// modules/carts/dal/cartline.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { CartLine } from "../cartline.model.ts";
import db from "../../../config/database.ts";

export class CartLineRepository extends GenericRepository<CartLine> {
    constructor() {
        super({
            tableName: "cart_lines",
            primaryKey: "cart_line_id", // d’après votre schéma, c’était "carteLineId" ou "cartLineId"
        });
    }

    async findByCartId(cartId: number): Promise<CartLine[]> {
        const client = db.getClient();
        const query = `SELECT * FROM ${this.tableName} WHERE cart_id = $1`;
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
        const query = `DELETE FROM ${this.tableName} WHERE cart_id = $1`;
        await client.queryArray({
            text: query,
            args: [cartId],
        });
    }
}

const cartLineRepository = new CartLineRepository();
export default cartLineRepository;
