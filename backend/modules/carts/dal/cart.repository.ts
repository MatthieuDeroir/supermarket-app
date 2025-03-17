// modules/carts/dal/cart.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { Cart } from "../cart.model.ts";
import db from "../../../config/database.ts";

export class CartRepository extends GenericRepository<Cart> {
    constructor() {
        super({
            tableName: "carts",    // Nom de la table dans votre DB
            primaryKey: "cart_id",  // PK
        });
    }

    async findActiveCartByUserId(userId: number): Promise<Cart | null> {
        const client = db.getClient();
        const query = `
        SELECT * 
        FROM carts 
        WHERE user_id = $1 AND payed = false
        LIMIT 1
    `;
        const result = await client.queryObject<Cart>({
            text: query,
            args: [userId],
        });
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    async findAllByUserId(userId: number): Promise<Cart[]> {
        const client = db.getClient();
        const query = `
        SELECT * 
        FROM carts 
        WHERE user_id = $1
    `;
        const result = await client.queryObject<Cart>({
            text: query,
            args: [userId],
        });
        return result.rows;
    }

}



const cartRepository = new CartRepository();
export default cartRepository;
