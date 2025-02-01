// modules/carts/bll/cart.service.ts
import cartRepository from "../dal/cart.repository.ts";
import cartLineRepository from "../dal/cartline.repository.ts";
import { Cart } from "../cart.model.ts";
import { CartLine } from "../cartline.model.ts";

import productRepository from "../../products/dal/product.repository.ts";
import logService from "../../logs/bll/log.service.ts";
import { ActionTypeEnum } from "../../../enums/actionTypeEnum.ts";
import { StockTypeEnum } from "../../../enums/stockTypeEnum.ts";

import invoiceRepository from "../../invoices/dal/invoice.repository.ts";
import invoiceLineRepository from "../../invoices/dal/invoiceline.repository.ts";

export interface CartWithLines extends Cart {
    lines: CartLine[];
}

class CartService {
    async getAllCarts(): Promise<CartWithLines[]> {
        const carts = await cartRepository.findAll();
        const result: CartWithLines[] = [];

        for (const cart of carts) {
            const lines = await cartLineRepository.findByCartId(cart.cart_id);
            result.push({ ...cart, lines });
        }
        return result;
    }

    async getCartById(cartId: number): Promise<CartWithLines | null> {
        const cart = await cartRepository.findById(cartId);
        if (!cart) return null;
        const lines = await cartLineRepository.findByCartId(cartId);
        return { ...cart, lines };
    }

    async createCart(data: Omit<Cart, "cart_id">): Promise<void> {
        await cartRepository.create(data);
    }

    async updateCart(cartId: number, data: Partial<Cart>): Promise<void> {
        await cartRepository.update(cartId, data);
    }

    async deleteCart(cartId: number): Promise<void> {
        await cartRepository.deleteById(cartId);
    }

    async getTotalAmount(cartId: number): Promise<number> {
        const cart = await cartRepository.findById(cartId);
        if (!cart) throw new Error(`Cart ${cartId} not found`);

        const lines = await cartLineRepository.findByCartId(cartId);
        let total = 0;
        for (const line of lines) {
            const product = await productRepository.findById(line.product_id);
            if (!product) throw new Error(`Product ${line.product_id} not found`);
            total += product.price * line.quantity;
        }

        return total;
    }

    /**
     * Ajouter un produit au cart => RETRAIT TEMPORAIRE du shelf.
     * Si aucun panier non payé n'existe pour l'utilisateur, il est créé automatiquement.
     */
    async addProductToCart(productId: number, quantity: number, userId: number): Promise<CartLine> {
        if (quantity <= 0) throw new Error("Quantity must be positive");

        // 1) Vérifier s'il existe un panier non payé pour l'utilisateur
        let cart = await cartRepository.findActiveCartByUserId(userId);
        if (!cart) {
            // Si aucun panier non payé n'existe, créer un nouveau panier
            const newCartData = {
                user_id: userId,
                payed: false,
                created_at: new Date(),
            };
            await cartRepository.create(newCartData);

            // Lire le panier créé
            const allCarts = await cartRepository.findAllByUserId(userId);
            cart = allCarts.find((c) => !c.payed) || null;
            if (!cart) throw new Error("Failed to create a new cart");
        }

        // 2) Vérifier le produit
        const product = await productRepository.findById(productId);
        if (!product) throw new Error(`Product ${productId} not found`);

        const availableShelf = product.stock_shelf_bottom ?? 0;
        if (availableShelf < quantity) throw new Error("Not enough stock on shelf");

        // 3) RETRAIT TEMPORAIRE => décrémenter le stock du shelf
        const newShelf = availableShelf - quantity;
        await productRepository.update(productId, { stock_shelf_bottom: newShelf });

        // 4) Vérifier si une cartLine existe déjà pour ce produit dans le panier
        let existingLine = await cartLineRepository.findOneByCartAndProduct(cart.cart_id, productId);
        if (existingLine) {
            // Si la cartLine existe, incrémenter la quantité
            const newQty = existingLine.quantity + quantity;
            await cartLineRepository.updateQuantity(existingLine.cart_line_id, newQty);

            // Relire la cartLine mise à jour
            existingLine = await cartLineRepository.findById(existingLine.cart_line_id);

            // Log l'opération
            const finalProduct = await productRepository.findById(productId);
            await logService.createLog({
                date: new Date(),
                user_id: userId,
                product_id: productId.toString(),
                quantity,
                reason: `Increment product in cart #${cart.cart_id}`,
                action: ActionTypeEnum.REMOVE_FROM,
                stockType: StockTypeEnum.SHELF,
                stock_warehouse_after: finalProduct?.stock_warehouse,
                stock_shelf_bottom_after: finalProduct?.stock_shelf_bottom,
            });

            return existingLine!;
        } else {
            // Si la cartLine n'existe pas, la créer
            await cartLineRepository.create({
                cart_id: cart.cart_id,
                product_id: productId,
                quantity,
                created_at: new Date(),
            });

            const newLine = await cartLineRepository.findOneByCartAndProduct(cart.cart_id, productId);

            // Log l'opération
            const finalProduct = await productRepository.findById(productId);
            await logService.createLog({
                date: new Date(),
                user_id: userId,
                product_id: productId.toString(),
                quantity,
                reason: `Add product to cart #${cart.cart_id}`,
                action: ActionTypeEnum.REMOVE_FROM,
                stockType: StockTypeEnum.SHELF,
                stock_warehouse_after: finalProduct?.stock_warehouse,
                stock_shelf_bottom_after: finalProduct?.stock_shelf_bottom,
            });

            return newLine!;
        }
    }


    /**
     * Retirer une cartLine => on REMET la quantité dans shelf
     */
    async removeCartLine(cartLineId: number, userId: number): Promise<void> {
        const cartLine = await cartLineRepository.findById(cartLineId);
        if (!cartLine) throw new Error(`CartLine ${cartLineId} not found`);

        const { product_id, quantity } = cartLine;
        const product = await productRepository.findById(product_id);
        if (!product) throw new Error(`Product ${product_id} not found`);

        // on rend la quantité au shelf
        const newShelf = (product.stock_shelf_bottom ?? 0) + quantity;
        await productRepository.update(product_id, { stock_shelf_bottom: newShelf });

        // on supprime la cartLine
        await cartLineRepository.deleteById(cartLineId);

        // log
        const finalProduct = await productRepository.findById(product_id);
        await logService.createLog({
            logId: 0,
            date: new Date(),
            user_id: userId,
            product_id: product_id.toString(),
            quantity,
            reason: `Remove cartLine #${cartLineId} (back to shelf)`,
            action: ActionTypeEnum.ADD_TO, // on ADD_TO shelf
            stockType: StockTypeEnum.SHELF,
            stock_warehouse_after: finalProduct?.stock_warehouse,
            stock_shelf_bottom_after: finalProduct?.stock_shelf_bottom,
        });
    }

    /**
     * PayCart => Créer une facture + ses lignes, enregistrer comme payé, loguer l'opération
     * @param cartId ID du panier
     * @param userId ID de l'utilisateur
     * @param addressId ID de l'adresse pour la facture
     */
    async payCart(cartId: number, userId: number, addressId: number): Promise<void> {
        // 1) Récupérer le cart
        const cart = await cartRepository.findById(cartId);
        if (!cart) throw new Error(`Cart ${cartId} not found`);
        if (cart.payed) throw new Error(`Cart ${cartId} is already paid`);

        // 2) Récupérer toutes les cartLines
        const lines = await cartLineRepository.findByCartId(cartId);
        if (lines.length === 0) throw new Error(`Cannot pay an empty cart`);

        // 3) Créer l'invoice avec le cart_id
        const invoiceData = {
            user_id: cart.user_id,
            address_id: addressId,
            cart_id: cartId, // Inclure l'ID du panier
            created_at: new Date(),
        };
        await invoiceRepository.create(invoiceData);

        // Récupérer l'ID de la dernière facture créée
        const allInvoices = await invoiceRepository.findAll();
        const newInvoice = allInvoices[allInvoices.length - 1];
        const invoiceId = newInvoice.invoice_id;

        // 4) Créer les invoiceLines et loguer chaque produit
        for (const line of lines) {
            const product = await productRepository.findById(line.product_id);
            if (!product) throw new Error(`Product ${line.product_id} not found`);

            // Créer l'invoiceLine avec le prix actuel
            const invoiceLineData = {
                product_id: line.product_id.toString(),
                quantity: line.quantity,
                price: product.price, // Enregistrer le prix actuel
                invoice_id: invoiceId,
                created_at: new Date(),
            };
            await invoiceLineRepository.create(invoiceLineData);

            // Loguer l'opération
            await logService.createLog({
                date: new Date(),
                user_id: userId,
                product_id: line.product_id.toString(),
                quantity: line.quantity,
                reason: `Product ${line.product_id} paid in cart #${cartId}, invoice #${invoiceId}`,
                action: ActionTypeEnum.PAYED,
                stockType: StockTypeEnum.CART,
                stock_warehouse_after: product.stock_warehouse,
                stock_shelf_bottom_after: product.stock_shelf_bottom,
            });
        }

        // 5) Marquer le cart comme payé
        await cartRepository.update(cartId, { payed: true, payed_at: new Date() });

        // 6) Log global pour le cart payé
        await logService.createLog({
            date: new Date(),
            user_id: userId,
            product_id: "0", // Aucun produit spécifique
            quantity: 0,
            reason: `Cart #${cartId} paid and invoice #${invoiceId} created`,
            action: ActionTypeEnum.PAYED,
            stockType: StockTypeEnum.CART,
            stock_warehouse_after: 0,
            stock_shelf_bottom_after: 0,
        });
    }



}

const cartService = new CartService();
export default cartService;
