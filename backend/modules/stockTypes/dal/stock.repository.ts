// modules/stock/dal/stock.repository.ts
import { getDBClient } from "../../../config/database.ts";
import { StockType } from "../stock.model.ts";

export class StockTypeRepository {
    async findAll(): Promise<StockType[]> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                stock_type_id: number;
                name: string;
                description: string;
            }>`SELECT * FROM stock_type`;

            return result.rows.map(row => ({
                stockTypeId: row.stock_type_id,
                name: row.name,
                description: row.description,
            }));
        } finally {
            client.release();
        }
    }
}