// modules/carts/dal/cartline.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { CartLine } from "../cartline.model.ts";
import db from "../../../config/database.ts";

export class CartLineRepository extends GenericRepository<CartLine> {
    constructor() {
        super({
            tableName: "cart_lines",    // correspond à votre table
            primaryKey: "cart_line_id", // pk
        });
    }

    /**
     * Trouver toutes les cartLines pour un cart donné
     */
    async findByCartId(cartId: number): Promise<CartLine[]> {
        const client = db.getClient();
        const query = `SELECT * FROM cart_lines WHERE cart_id = $1`;
        const result = await client.queryObject<CartLine>({
            text: query,
            args: [cartId],
        });
        return result.rows;
    }

    /**
     * Supprimer toutes les cartLines associées à un cartId
     */
    async deleteByCartId(cartId: number): Promise<void> {
        const client = db.getClient();
        const query = `DELETE FROM cart_lines WHERE cart_id = $1`;
        await client.queryArray({
            text: query,
            args: [cartId],
        });
    }

    /**
     * Trouver une cartLine unique via (cart_id, product_id)
     * Utile pour vérifier si on doit créer ou simplement incrémenter
     */
    async findOneByCartAndProduct(cartId: number, productId: number): Promise<CartLine | null> {
        const client = db.getClient();
        const query = `SELECT * FROM cart_lines WHERE cart_id = $1 AND product_id = $2 LIMIT 1`;
        const result = await client.queryObject<CartLine>({
            text: query,
            args: [cartId, productId],
        });
        if (result.rows.length > 0) {
            return result.rows[0];
        }
        return null;
    }

    /**
     * Met à jour la quantité d'une cartLine existante
     */
    async updateQuantity(cartLineId: number, newQuantity: number): Promise<void> {
        // on peut appeler super.update(...) ou faire une requête manuelle
        // super.update(cartLineId, { quantity: newQuantity } as Partial<CartLine>);
        // Ci-dessous, requête directe :
        const client = db.getClient();
        const query = `UPDATE cart_lines SET quantity = $1 WHERE cart_line_id = $2`;
        await client.queryArray({
            text: query,
            args: [newQuantity, cartLineId],
        });
    }
}

const cartLineRepository = new CartLineRepository();
export default cartLineRepository;
