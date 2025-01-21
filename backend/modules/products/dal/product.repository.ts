// modules/products/dal/product.repository.ts
import db from "../../../config/database.ts";
import { GenericRepository } from "../../generic.repository.ts";
import { Product } from "../product.model.ts";

export class ProductRepository extends GenericRepository<Product> {
    constructor() {
        super({
            tableName: "products",      // Table en DB
            primaryKey: "product_id",   // PK = product_id (snake_case)
        });
    }

    /**
     * Insère un produit et retourne son product_id.
     */
    async createReturningId(data: Partial<Product>): Promise<number> {
        const client = db.getClient();
        const columns = Object.keys(data);   // ["ean", "name", "brand", ...]
        const values = Object.values(data);

        const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
        const query = `
            INSERT INTO products (${columns.join(", ")})
            VALUES (${placeholders})
            RETURNING product_id
        `;

        const result = await client.queryObject<{ product_id: number }>({
            text: query,
            args: values,
        });
        return result.rows[0].product_id;
    }
}

const productRepository = new ProductRepository();
export default productRepository;
