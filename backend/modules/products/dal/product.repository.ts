// modules/products/dal/product.repository.ts
import { getDBClient } from "../../../config/database.ts";
import { Product } from "../product.model.ts";

export class ProductRepository {
    async createProduct(product: Product): Promise<Product> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                product_id: string;
                price: number;
                stock_warehouse: number;
                stock_shelf_bottom: number;
                minimum_stock: number;
                minimum_shelf_stock: number;
                tax_category_id: number;
            }>`
                INSERT INTO products
                (product_id, price, stock_warehouse, stock_shelf_bottom,
                 minimum_stock, minimum_shelf_stock, tax_category_id)
                VALUES
                (${product.productId}, ${product.price}, ${product.stockWarehouse},
                 ${product.stockShelfBottom}, ${product.minimumStock},
                 ${product.minimumShelfStock}, ${product.taxCategoryId})
                RETURNING *
            `;

            return {
                productId: result.rows[0].product_id,
                price: result.rows[0].price,
                stockWarehouse: result.rows[0].stock_warehouse,
                stockShelfBottom: result.rows[0].stock_shelf_bottom,
                minimumStock: result.rows[0].minimum_stock,
                minimumShelfStock: result.rows[0].minimum_shelf_stock,
                taxCategoryId: result.rows[0].tax_category_id,
            };
        } finally {
            client.release();
        }
    }

    async findById(productId: string): Promise<Product | null> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                product_id: string;
                price: number;
                stock_warehouse: number;
                stock_shelf_bottom: number;
                minimum_stock: number;
                minimum_shelf_stock: number;
                tax_category_id: number;
            }>`
                SELECT * FROM products WHERE product_id = ${productId}
            `;

            if (result.rows.length === 0) return null;

            const row = result.rows[0];
            return {
                productId: row.product_id,
                price: row.price,
                stockWarehouse: row.stock_warehouse,
                stockShelfBottom: row.stock_shelf_bottom,
                minimumStock: row.minimum_stock,
                minimumShelfStock: row.minimum_shelf_stock,
                taxCategoryId: row.tax_category_id,
            };
        } finally {
            client.release();
        }
    }
}