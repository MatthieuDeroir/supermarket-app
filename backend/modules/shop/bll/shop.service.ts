// modules/shop/bll/shop.service.ts
import db from "../../../config/database.ts";
import cartRepository from "../../carts/dal/cart.repository.ts";
import cartLineRepository from "../../carts/dal/cartline.repository.ts";
import productRepository from "../../products/dal/product.repository.ts";
import logService from "../../logs/bll/log.service.ts";
import { ActionTypeEnum } from "../../../enums/actionTypeEnum.ts";
import { StockTypeEnum } from "../../../enums/stockTypeEnum.ts";
import { CloseShopResponseDto } from "../dto/shop.dto.ts";
import { Cart } from "../../carts/cart.model.ts";

class ShopService {
    /**
     * Close shop - returns all items from active carts back to shelves
     * This should be run at the end of the day
     */
    async closeShop(userId: number): Promise<CloseShopResponseDto> {
        // Start a transaction
        const client = db.getClient();

        try {
            await client.queryArray("BEGIN");

            // 1. Get all unpaid carts
            const unpaidCarts = await this.getUnpaidCarts();
            if (unpaidCarts.length === 0) {
                return {
                    success: true,
                    cartsProcessed: 0,
                    productsReturned: 0
                };
            }

            // 2. Track statistics for return value
            let productsReturned = 0;
            const failedCarts: string[] = [];

            // 3. Process each cart
            for (const cart of unpaidCarts) {
                try {
                    // Ensure cart has the required properties
                    if (!cart || typeof cart.cart_id !== 'number') {
                        console.error("Invalid cart object:", cart);
                        failedCarts.push("unknown");
                        continue;
                    }

                    // Get all cart lines for this cart
                    const cartLines = await cartLineRepository.findByCartId(cart.cart_id);

                    // Process each product in the cart
                    for (const line of cartLines) {
                        const product = await productRepository.findById(line.product_id);
                        if (!product) {
                            console.error(`Product ${line.product_id} not found, skipping`);
                            continue;
                        }

                        // Return quantity back to shelf
                        const newShelfQuantity = (product.stock_shelf_bottom ?? 0) + line.quantity;
                        await productRepository.update(line.product_id, {
                            stock_shelf_bottom: newShelfQuantity
                        });

                        // Log the return operation
                        const updatedProduct = await productRepository.findById(line.product_id);
                        if (updatedProduct) {
                            const currentTime = new Date();

                            // Log removal from cart
                            await logService.createLog({
                                date: currentTime,
                                userId: userId,
                                productId: line.product_id,
                                quantity: line.quantity,
                                reason: `Close shop: Remove from cart #${cart.cart_id}`,
                                action: ActionTypeEnum.REMOVE_FROM,
                                stockType: StockTypeEnum.CART,
                                stockWarehouseAfter: updatedProduct.stock_warehouse ?? 0,
                                stockShelfBottomAfter: updatedProduct.stock_shelf_bottom ?? 0
                            });

                            // Log addition to shelf
                            await logService.createLog({
                                date: currentTime,
                                userId: userId,
                                productId: line.product_id,
                                quantity: line.quantity,
                                reason: `Close shop: Return to shelf from cart #${cart.cart_id}`,
                                action: ActionTypeEnum.ADD_TO,
                                stockType: StockTypeEnum.SHELF,
                                stockWarehouseAfter: updatedProduct.stock_warehouse ?? 0,
                                stockShelfBottomAfter: updatedProduct.stock_shelf_bottom ?? 0
                            });

                            productsReturned++;
                        }
                    }

                    // Remove all cart lines
                    await cartLineRepository.deleteByCartId(cart.cart_id);

                    // Delete the cart
                    await cartRepository.deleteById(cart.cart_id);

                } catch (error) {
                    console.error(`Error processing cart ${cart.cart_id}:`, error);
                    failedCarts.push(cart.cart_id.toString());
                }
            }

            await client.queryArray("COMMIT");

            return {
                success: true,
                cartsProcessed: unpaidCarts.length,
                productsReturned,
                failedCarts: failedCarts.length > 0 ? failedCarts : undefined
            };

        } catch (error) {
            await client.queryArray("ROLLBACK");
            console.error("Error during closeShop:", error);

            return {
                success: false,
                cartsProcessed: 0,
                productsReturned: 0,
                failedCarts: ["Transaction failed"]
            };
        }
    }

    /**
     * Helper method to get all unpaid carts
     */
    private async getUnpaidCarts(): Promise<Cart[]> {
        const client = db.getClient();
        const query = `SELECT * FROM carts WHERE payed = false`;
        const result = await client.queryObject<Cart>({
            text: query
        });
        return result.rows;
    }
}

export const shopService = new ShopService();
export default shopService;