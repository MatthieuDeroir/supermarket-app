// modules/carts/dal/cartline.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { CartLine } from "../cartline.model.ts";
import db from "../../../config/database.ts";

export class CartLineRepository extends GenericRepository<CartLine> {
    constructor() {
        super({
            tableName: "cart_lines",
            primaryKey: "cart_line_id",
        });
    }

    async findByCartId(cartId: number): Promise<CartLine[]> {
        const client = db.getClient();
        const query = `SELECT * FROM cart_lines WHERE cart_id = $1`;
        const result = await client.queryObject<CartLine>({
            text: query,
            args: [cartId],
        });
        return result.rows;
    }

    async deleteByCartId(cartId: number): Promise<void> {
        const client = db.getClient();
        const query = `DELETE FROM cart_lines WHERE cart_id = $1`;
        await client.queryArray({
            text: query,
            args: [cartId],
        });
    }

    async findOneByCartAndProduct(cartId: number, productId: number): Promise<CartLine | null> {
        const client = db.getClient();
        const query = `SELECT * FROM cart_lines WHERE cart_id = $1 AND product_id = $2 LIMIT 1`;
        const result = await client.queryObject<CartLine>({
            text: query,
            args: [cartId, productId],
        });
        if (result.rows.length === 0) return null;
        return result.rows[0];
    }

    async updateQuantity(cartLineId: number, newQuantity: number): Promise<void> {
        // On peut appeler super.update(...) ou faire une requête manuelle
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
