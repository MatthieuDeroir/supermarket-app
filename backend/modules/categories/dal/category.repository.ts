// modules/tax/dal/tax-category.repository.ts
import { getDBClient } from "../../../config/database.ts";
import { TaxCategoryCreateDto } from "../dto/tax-create.dto.ts";
import { TaxCategory } from "../tax.model.ts";

export class TaxCategoryRepository {
    async create(taxCategory: TaxCategoryCreateDto): Promise<TaxCategory> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                tax_category_id: number;
                value: number;
                description: string;
            }>`
                INSERT INTO tax_category (value, description)
                VALUES (${taxCategory.value}, ${taxCategory.description})
                RETURNING *
            `;

            return {
                taxCategoryId: result.rows[0].tax_category_id,
                value: result.rows[0].value,
                description: result.rows[0].description,
            };
        } finally {
            client.release();
        }
    }

    async findAll(): Promise<TaxCategory[]> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                tax_category_id: number;
                value: number;
                description: string;
            }>`SELECT * FROM tax_category`;

            return result.rows.map(row => ({
                taxCategoryId: row.tax_category_id,
                value: row.value,
                description: row.description,
            }));
        } finally {
            client.release();
        }
    }
}