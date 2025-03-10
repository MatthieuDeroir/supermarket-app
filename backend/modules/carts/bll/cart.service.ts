// modules/carts/bll/cart.service.ts
import db from "../../../config/database.ts";
import cartRepository from "../dal/cart.repository.ts";
import cartLineRepository from "../dal/cartline.repository.ts";
import { Cart } from "../cart.model.ts";
import { CartLine } from "../cartline.model.ts";
import productRepository from "../../products/dal/product.repository.ts";
import promotionService from "../../promotions/bll/promotion.service.ts";
import logService from "../../logs/bll/log.service.ts";
import { ActionTypeEnum } from "../../../enums/actionTypeEnum.ts";
import { StockTypeEnum } from "../../../enums/stockTypeEnum.ts";
import invoiceRepository from "../../invoices/dal/invoice.repository.ts";
import invoiceLineRepository from "../../invoices/dal/invoiceline.repository.ts";
import addressRepository from "../../addresses/dal/address.repository.ts";
import { CartResponseDto } from "../dto/cart.dto.ts";
import { CartLineResponseDto } from "../dto/cartline.dto.ts";
import { ProductResponseDto } from "../../products/dto/product.dto.ts";

export interface CartWithLines extends Cart {
    lines: CartLine[];
}

class CartService {
    /**
     * Get all carts with their lines
     */
    async getAllCarts(): Promise<CartResponseDto[]> {
        const carts = await cartRepository.findAll();
        const result: CartResponseDto[] = [];

        for (const cart of carts) {
            result.push(await this.getCartWithDetails(cart));
        }
        return result;
    }

    /**
     * Get a cart by ID with all its lines
     */
    async getCartById(cartId: number): Promise<CartResponseDto | null> {
        const cart = await cartRepository.findById(cartId);
        if (!cart) return null;

        return await this.getCartWithDetails(cart);
    }

    /**
     * Create a new cart
     */
    async createCart(data: { user_id: number }): Promise<CartResponseDto> {
        const cartData = {
            user_id: data.user_id,
            payed: false,
            created_at: new Date(),
        };

        // First check if the user already has an active cart
        const existingCart = await cartRepository.findActiveCartByUserId(data.user_id);
        if (existingCart) {
            return await this.getCartWithDetails(existingCart);
        }

        // No active cart exists, create a new one
        await cartRepository.create(cartData);

        // Retrieve the new cart
        const allCarts = await cartRepository.findAllByUserId(data.user_id);
        const newestCart = allCarts.find(c => !c.payed);

        if (!newestCart) {
            throw new Error("Failed to create a new cart");
        }

        return await this.getCartWithDetails(newestCart);
    }

    /**
     * Update a cart
     */
    async updateCart(cartId: number, data: Partial<Cart>): Promise<CartResponseDto> {
        const cart = await cartRepository.findById(cartId);
        if (!cart) {
            throw new Error(`Cart with ID ${cartId} not found`);
        }

        await cartRepository.update(cartId, data);

        const updatedCart = await cartRepository.findById(cartId);
        if (!updatedCart) {
            throw new Error(`Failed to retrieve updated cart with ID ${cartId}`);
        }

        return await this.getCartWithDetails(updatedCart);
    }

    /**
     * Delete a cart and its lines
     */
    async deleteCart(cartId: number): Promise<void> {
        const client = db.getClient();

        try {
            await client.queryArray("BEGIN");

            // First delete all cart lines (foreign key constraint)
            await cartLineRepository.deleteByCartId(cartId);

            // Then delete the cart itself
            await cartRepository.deleteById(cartId);

            await client.queryArray("COMMIT");
        } catch (error) {
            await client.queryArray("ROLLBACK");
            throw error;
        }
    }

    /**
     * Calculate the total amount for a cart (with promotions applied)
     */
    async getTotalAmount(cartId: number): Promise<number> {
        const cart = await cartRepository.findById(cartId);
        if (!cart) throw new Error(`Cart ${cartId} not found`);

        const lines = await cartLineRepository.findByCartId(cartId);
        let total = 0;

        for (const line of lines) {
            const product = await productRepository.findById(line.product_id);
            if (!product) throw new Error(`Product ${line.product_id} not found`);

            // Check if the product has an active promotion
            const { discountedPrice, originalPrice } = await promotionService.getProductPriceWithPromotion(line.product_id);

            // Use the discounted price if available, otherwise use original price
            const effectivePrice = discountedPrice !== null ? discountedPrice : originalPrice;
            total += effectivePrice * line.quantity;
        }

        return parseFloat(total.toFixed(2));
    }

    /**
     * Add a product to a cart, creating a new active cart if none exists
     */
    async addProductToCart(productId: number, quantity: number, userId: number): Promise<CartLineResponseDto> {
        if (quantity <= 0) throw new Error("Quantity must be positive");

        const client = db.getClient();

        try {
            await client.queryArray("BEGIN");

            // 1) Get or create active cart for user
            let cart = await cartRepository.findActiveCartByUserId(userId);

            if (!cart) {
                // Create a new cart for the user
                const newCartData = {
                    user_id: userId,
                    payed: false,
                    created_at: new Date(),
                };

                await cartRepository.create(newCartData);

                // Get the newly created cart
                const allCarts = await cartRepository.findAllByUserId(userId);
                cart = allCarts.find((c) => !c.payed) || null;

                if (!cart) {
                    throw new Error("Failed to create a new cart");
                }
            }

            // 2) Check product availability
            const product = await productRepository.findById(productId);
            if (!product) throw new Error(`Product ${productId} not found`);

            const availableShelf = product.stock_shelf_bottom ?? 0;
            if (availableShelf < quantity) throw new Error(`Not enough stock on shelf. Available: ${availableShelf}, Requested: ${quantity}`);

            // 3) Temporary removal from shelf
            const newShelf = availableShelf - quantity;
            await productRepository.update(productId, { stock_shelf_bottom: newShelf });

            // 4) Check if the product is already in the cart
            let cartLine = await cartLineRepository.findOneByCartAndProduct(cart.cart_id, productId);
            let result;

            if (cartLine) {
                // Update existing cart line
                const newQty = cartLine.quantity + quantity;
                await cartLineRepository.updateQuantity(cartLine.cart_line_id, newQty);

                // Reload cart line
                cartLine = await cartLineRepository.findById(cartLine.cart_line_id);
                if (!cartLine) throw new Error("Failed to reload cart line");

                result = await this.mapToCartLineResponseDto(cartLine);
            } else {
                // Create new cart line
                const cartLineData = {
                    cart_id: cart.cart_id,
                    product_id: productId,
                    quantity: quantity,
                    created_at: new Date(),
                };

                await cartLineRepository.create(cartLineData);

                // Get the new line
                const newLine = await cartLineRepository.findOneByCartAndProduct(cart.cart_id, productId);
                if (!newLine) throw new Error("Failed to retrieve new cart line");

                result = await this.mapToCartLineResponseDto(newLine);
            }

            // 5) Log the operation
            const finalProduct = await productRepository.findById(productId);
            if (!finalProduct) throw new Error(`Failed to reload product ${productId}`);

            await logService.createLog({
                date: new Date(),
                userId: userId,
                productId: productId,
                quantity: quantity,
                reason: cartLine ? `Update item in cart #${cart.cart_id}` : `Add item to cart #${cart.cart_id}`,
                action: ActionTypeEnum.REMOVE_FROM,
                stockType: StockTypeEnum.SHELF,
                stockWarehouseAfter: finalProduct.stock_warehouse ?? 0,
                stockShelfBottomAfter: finalProduct.stock_shelf_bottom ?? 0,
            });

            await client.queryArray("COMMIT");
            return result;

        } catch (error) {
            await client.queryArray("ROLLBACK");
            throw error;
        }
    }

    /**
     * Remove a product from a cart, returning its quantity to the shelf
     */
    async removeCartLine(cartLineId: number, userId: number): Promise<void> {
        const client = db.getClient();

        try {
            await client.queryArray("BEGIN");

            const cartLine = await cartLineRepository.findById(cartLineId);
            if (!cartLine) throw new Error(`Cart line ${cartLineId} not found`);

            const { product_id, quantity } = cartLine;
            const product = await productRepository.findById(product_id);
            if (!product) throw new Error(`Product ${product_id} not found`);

            // Return quantity to shelf
            const newShelf = (product.stock_shelf_bottom ?? 0) + quantity;
            await productRepository.update(product_id, { stock_shelf_bottom: newShelf });

            // Delete the cart line
            await cartLineRepository.deleteById(cartLineId);

            // Log the operation
            const finalProduct = await productRepository.findById(product_id);
            if (!finalProduct) throw new Error(`Failed to reload product ${product_id}`);

            await logService.createLog({
                date: new Date(),
                userId: userId,
                productId: product_id,
                quantity: quantity,
                reason: `Remove item from cart (return to shelf)`,
                action: ActionTypeEnum.ADD_TO,
                stockType: StockTypeEnum.SHELF,
                stockWarehouseAfter: finalProduct.stock_warehouse ?? 0,
                stockShelfBottomAfter: finalProduct.stock_shelf_bottom ?? 0,
            });

            await client.queryArray("COMMIT");

        } catch (error) {
            await client.queryArray("ROLLBACK");
            throw error;
        }
    }

    /**
     * Pay for a cart - create invoice and invoice lines, keep products in their state
     */
    async payCart(cartId: number, userId: number, addressId: number): Promise<number> {
        const client = db.getClient();

        try {
            await client.queryArray("BEGIN");

            // 1) Validate cart
            const cart = await cartRepository.findById(cartId);
            if (!cart) throw new Error(`Cart ${cartId} not found`);
            if (cart.payed) throw new Error(`Cart ${cartId} is already paid`);

            // 2) Validate address
            const address = await addressRepository.findById(addressId);
            if (!address) throw new Error(`Address ${addressId} not found`);

            // 3) Get cart lines
            const cartLines = await cartLineRepository.findByCartId(cartId);
            if (cartLines.length === 0) throw new Error("Cannot pay an empty cart");

            // 4) Create invoice
            const invoiceData = {
                user_id: cart.user_id,
                address_id: addressId,
                cart_id: cartId,
                created_at: new Date(),
            };

            await invoiceRepository.create(invoiceData);

            // Get the newly created invoice ID
            const invoices = await invoiceRepository.findAll();
            const newInvoice = invoices[invoices.length - 1]; // This should be replaced with a more reliable method
            const invoiceId = newInvoice.invoice_id;

            // 5) Create invoice lines for each product
            const currentDate = new Date();

            for (const line of cartLines) {
                console.log(`Logging product ${line.product_id} with quantity ${line.quantity}`);

                const product = await productRepository.findById(line.product_id);
                if (!product) {
                    throw new Error(`Product ${line.product_id} not found`);
                }

                // Get the effective price (with promotion if applicable)
                const { discountedPrice, originalPrice } = await promotionService.getProductPriceWithPromotion(line.product_id);
                const effectivePrice = discountedPrice !== null ? discountedPrice : originalPrice;

                // Create invoice line
                const invoiceLineData = {
                    product_id: line.product_id.toString(),
                    quantity: line.quantity,
                    price: effectivePrice,
                    invoice_id: invoiceId,
                    created_at: currentDate,
                };

                await invoiceLineRepository.create(invoiceLineData);

                // Log the payment for this product
                await logService.createLog({
                    date: currentDate,
                    userId: userId,
                    productId: line.product_id,
                    quantity: line.quantity,
                    reason: `Product paid in cart #${cartId}, invoice #${invoiceId}`,
                    action: ActionTypeEnum.PAYED,
                    stockType: StockTypeEnum.CART,
                    stockWarehouseAfter: product.stock_warehouse ?? 0,
                    stockShelfBottomAfter: product.stock_shelf_bottom ?? 0,
                });
            }

            // 6) Mark cart as paid
            await cartRepository.update(cartId, {
                payed: true,
                payed_at: currentDate
            });

            // 7) Log the entire cart payment
            await logService.createLog({
                date: currentDate,
                userId: userId,
                productId: 0, // No specific product
                quantity: 0,
                reason: `Cart #${cartId} paid - invoice #${invoiceId} created`,
                action: ActionTypeEnum.PAYED,
                stockType: StockTypeEnum.CART,
                stockWarehouseAfter: 0,
                stockShelfBottomAfter: 0,
            });

            await client.queryArray("COMMIT");

            return invoiceId;

        } catch (error) {
            await client.queryArray("ROLLBACK");
            throw error;
        }
    }

    /**
     * Get user's active (unpaid) cart
     */
    async getUserActiveCart(userId: number): Promise<CartResponseDto | null> {
        const cart = await cartRepository.findActiveCartByUserId(userId);
        if (!cart) return null;

        return await this.getCartWithDetails(cart);
    }

    /**
     * Get all carts for a user
     */
    async getUserCarts(userId: number): Promise<CartResponseDto[]> {
        const carts = await cartRepository.findAllByUserId(userId);
        const result: CartResponseDto[] = [];

        for (const cart of carts) {
            result.push(await this.getCartWithDetails(cart));
        }

        return result;
    }

    /**
     * Helper method to get cart with all details and calculations
     */
    private async getCartWithDetails(cart: Cart): Promise<CartResponseDto> {
        const lines = await cartLineRepository.findByCartId(cart.cart_id);
        const lineResponses: CartLineResponseDto[] = [];
        let total = 0;

        // Process each line to get product details and prices
        for (const line of lines) {
            const product = await productRepository.findById(line.product_id);
            if (!product) continue;

            const { discountedPrice, originalPrice, promotion } =
                await promotionService.getProductPriceWithPromotion(line.product_id);

            const effectivePrice = discountedPrice !== null ? discountedPrice : originalPrice;
            const lineTotal = effectivePrice * line.quantity;
            total += lineTotal;

            const productResponse: ProductResponseDto = {
                id: product.product_id,
                ean: product.ean,
                name: product.name,
                brand: product.brand,
                description: product.description,
                picture: product.picture,
                nutritionalInformation: product.nutritional_information,
                price: originalPrice,
                stockWarehouse: product.stock_warehouse ?? 0,
                stockShelfBottom: product.stock_shelf_bottom ?? 0,
                minimumStock: product.minimum_stock,
                minimumShelfStock: product.minimum_shelf_stock,
                categoryId: product.category_id,
                promotion: promotion,
                finalPrice: effectivePrice
            };

            lineResponses.push({
                id: line.cart_line_id,
                productId: line.product_id,
                quantity: line.quantity,
                cartId: line.cart_id,
                createdAt: line.createdAt,
                product: productResponse
            });
        }

        return {
            id: cart.cart_id,
            userId: cart.user_id,
            payed: cart.payed,
            createdAt: cart.createdAt,
            payedAt: cart.payedAt,
            lines: lineResponses,
            total: parseFloat(total.toFixed(2))
        };
    }

    /**
     * Map cart line to response DTO
     */
    private async mapToCartLineResponseDto(cartLine: CartLine): Promise<CartLineResponseDto> {
        const product = await productRepository.findById(cartLine.product_id);

        let productResponse: ProductResponseDto | undefined;

        if (product) {
            const { discountedPrice, originalPrice, promotion } =
                await promotionService.getProductPriceWithPromotion(product.product_id);

            productResponse = {
                id: product.product_id,
                ean: product.ean,
                name: product.name,
                brand: product.brand,
                description: product.description,
                picture: product.picture,
                nutritionalInformation: product.nutritional_information,
                price: originalPrice,
                stockWarehouse: product.stock_warehouse ?? 0,
                stockShelfBottom: product.stock_shelf_bottom ?? 0,
                minimumStock: product.minimum_stock,
                minimumShelfStock: product.minimum_shelf_stock,
                categoryId: product.category_id,
                promotion: promotion,
                finalPrice: discountedPrice !== null ? discountedPrice : originalPrice
            };
        }

        return {
            id: cartLine.cart_line_id,
            productId: cartLine.product_id,
            quantity: cartLine.quantity,
            cartId: cartLine.cart_id,
            createdAt: cartLine.createdAt,
            product: productResponse
        };
    }
}

const cartService = new CartService();
export default cartService;
