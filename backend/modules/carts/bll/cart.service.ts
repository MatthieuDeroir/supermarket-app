// modules/carts/bll/cart.service.ts
import cartRepository from "../dal/cart.repository.ts";
import cartLineRepository from "../dal/cartline.repository.ts";
import { Cart } from "../cart.model.ts";
import { CartLine } from "../cartline.model.ts";

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
            const lines = await cartLineRepository.findByCartId(cart.cartId);
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
}

const cartService = new CartService();
export default cartService;
