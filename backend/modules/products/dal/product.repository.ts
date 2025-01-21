// modules/products/dal/product.repository.ts
import db from "../../../config/database.ts";
import { GenericRepository } from "../../generic.repository.ts";
import { Product } from "../product.model.ts";

export class ProductRepository extends GenericRepository<Product> {
    constructor() {
        super({
            tableName: "Products",   // Nom de la table
            primaryKey: "productId", // Nom de la PK (type number)
        });
    }

    async createReturningId(data: Partial<Product>): Promise<number> {
        const client = db.getClient();
        const columns = Object.keys(data);
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
