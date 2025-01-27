// modules/carts/bll/cart.service.ts
import cartRepository from "../dal/cart.repository.ts";
import cartLineRepository from "../dal/cartline.repository.ts";
import { Cart } from "../cart.model.ts";
import { CartLine } from "../cartline.model.ts";
import logService from "../../logs/bll/log.service.ts";
import productRepository from "../../products/dal/product.repository.ts";
import { ActionTypeEnum } from "../../../enums/actionTypeEnum.ts";

export interface CartWithLines extends Cart {
    lines: CartLine[];
}

class CartService {
    /**
     * Récupère tous les carts, chacun avec ses lignes associées
     */
    async getAllCarts(): Promise<CartWithLines[]> {
        const carts = await cartRepository.findAll(); // tous les carts
        const result: CartWithLines[] = [];

        // Pour chacun, on récupère les cartLines
        for (const cart of carts) {
            const lines = await cartLineRepository.findByCartId(cart.cart_id);
            result.push({
                ...cart,
                lines,
            });
        }
        return result;
    }

    /**
     * Récupère un cart (par son cartId) + ses lignes
     */
    async getCartById(cartId: number): Promise<CartWithLines | null> {
        const cart = await cartRepository.findById(cartId);
        if (!cart) return null;

        const lines = await cartLineRepository.findByCartId(cartId);
        return { ...cart, lines };
    }

    /**
     * Crée un nouveau cart (et éventuellement des lignes si besoin)
     */
    async createCart(data: Omit<Cart, "cartId">): Promise<void> {
        // validations, etc.
        await cartRepository.create(data);
    }

    /**
     * Met à jour un cart
     */
    async updateCart(cartId: number, data: Partial<Cart>): Promise<void> {
        // validations, etc.
        await cartRepository.update(cartId, data);
    }

    /**
     * Supprime un cart
     */
    async deleteCart(cartId: number): Promise<void> {
        // Hard-delete
        await cartRepository.deleteById(cartId);
    }

    /**
     * Payer un cart => passer payed = true, payedAt = now
     * et supprimer toutes les cartLines associées.
     * On log l'opération.
     */
    async payCart(cartId: number, userId: number): Promise<void> {
        // 1) Récupérer le cart complet
        const cart = await cartRepository.findById(cartId);
        if (!cart) {
            throw new Error(`Cart ${cartId} not found`);
        }

        // Vérifier s’il est déjà payé
        if (cart.payed) {
            throw new Error(`Cart ${cartId} is already paid`);
        }

        // 2) Supprimer toutes les cartLines associées
        // await cartLineRepository.deleteByCartId(cartId);

        // 3) Mettre payed = true, payedAt = now
        const now = new Date();
        await cartRepository.update(cartId, {
            payed: true,
            payedAt: now,
        });

        // 4) Log l'opération
        // (userId peut venir du paramètre ou plus tard du JWT)
        await logService.createLog({
            logId: 0,                 // PK auto
            date: now,
            userId,                   // l'utilisateur qui paie
            productId: "",           // pas de produit particulier
            quantity: 0,
            reason: `Cart ${cartId} paid -> cartLines removed`,
        });
    }


    /**
     * Ajouter un produit (productId, quantity) dans un cart (cartId).
     * - Vérifie la dispo shelf
     * - Réserve la quantité => décrémente stock_shelf_bottom
     * - Crée la cartLine
     * - Log l’opération
     */
    // modules/carts/bll/cart.service.ts
    async addProductToCart(
        cartId: number,
        productId: number,
        quantity: number,
        userId: number
    ): Promise<CartLine> {
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        // 1) Vérifier que le cart existe
        const cart = await cartRepository.findById(cartId);
        if (!cart) {
            throw new Error(`Cart ${cartId} not found`);
        }

        // 2) Vérifier le produit + stock shelf
        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product ${productId} not found`);
        }

        const availableShelf = product.stock_shelf_bottom ?? 0;
        if (availableShelf < quantity) {
            throw new Error("Not enough stock on shelf");
        }

        // 3) Décrémenter stock_shelf_bottom
        const newShelf = availableShelf - quantity;
        await productRepository.update(productId, { stock_shelf_bottom: newShelf });

        // 4) Vérifier si une cartLine pour (cartId, productId) existe déjà
        let existingLine = await cartLineRepository.findOneByCartAndProduct(cartId, productId);

        if (existingLine) {
            // 4.a) Si elle existe, on incrémente la quantité
            const oldQty = existingLine.quantity;
            const newQty = oldQty + quantity;

            await cartLineRepository.updateQuantity(existingLine.cart_line_id, newQty);

            // Relire la cartLine mise à jour
            existingLine = await cartLineRepository.findById(existingLine.cart_line_id);

            // 5) Log l’opération : on précise qu’on a ajouté `quantity` en plus
            await logService.createLog({
                date: new Date(),
                user_id: userId,
                product_id: productId,
                quantity,
                reason: `Add (increment) product in cart #${cartId}`,
                action: ActionTypeEnum.ADD_TO_CART,
            });

            // On retourne la cartLine finalisée
            return existingLine!;
        } else {
            // 4.b) Sinon, on crée une nouvelle cartLine
            const cartLineData: Partial<CartLine> = {
                cart_id: cartId,
                product_id: productId,
                quantity,
                created_at: new Date(),
            };
            await cartLineRepository.create(cartLineData);

            // Retrouver la cartLine créée (hypothèse : findOneByCartAndProduct)
            const newLine = await cartLineRepository.findOneByCartAndProduct(cartId, productId);

            // 5) Log l’opération
            await logService.createLog({
                log_id: 0,
                date: new Date(),
                user_id: userId,
                product_id: String(productId),
                quantity,
                reason: `Add product to cart #${cartId}`,
                action: ActionTypeEnum.ADD_TO_CART,
            });

            return newLine!;
        }
    }


    /**
     * Retirer une cartLine du cart => rétablir la quantité sur shelf
     * puis supprimer la cartLine et log l’opération.
     */
    // modules/carts/bll/cart.service.ts
    async removeCartLine(cartLineId: number, userId: number): Promise<void> {
        // 1) Retrouver la cartLine
        const cartLine = await cartLineRepository.findById(cartLineId);
        if (!cartLine) {
            throw new Error(`CartLine ${cartLineId} not found`);
        }

        // On récupère product_id et quantity
        const { product_id, quantity } = cartLine;

        // 2) Retrouver le produit => ré-incrémenter shelf
        const product = await productRepository.findById(product_id);
        if (!product) {
            throw new Error(`Product ${product_id} not found`);
        }

        const currentShelf = product.stock_shelf_bottom ?? 0;
        const newShelf = currentShelf + quantity;

        await productRepository.update(product_id, {
            stock_shelf_bottom: newShelf,
        });

        // 3) Supprimer la cartLine
        await cartLineRepository.deleteById(cartLineId);

        // 4) Log l’opération
        await logService.createLog({
            date: new Date(),
            user_id: userId,                      // l'utilisateur qui effectue l'opération
            product_id: product_id.toString(),    // si log.table a product_id en string
            quantity,
            reason: `Remove cartLine #${cartLineId}`,
            action: ActionTypeEnum.REMOVE_FROM_CART,
        });
    }


}

const cartService = new CartService();
export default cartService;
