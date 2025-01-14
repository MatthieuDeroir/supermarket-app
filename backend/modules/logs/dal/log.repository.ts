// modules/logs/dal/log.repository.ts
import { getDBClient } from "../../../config/database.ts";
import { Log } from "../log.model.ts";

export class LogRepository {
    async createLog(log: Log): Promise<Log> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                stock_log_id: number;
                date: Date;
                user_id: number;
                product_id: string;
                stock_type_id: number;
                action_id: number;
                quantity: number;
                operation: string;
                reason: string;
            }>`
                INSERT INTO logs
                (date, user_id, product_id, stock_type_id, action_id,
                 quantity, operation, reason)
                VALUES
                (${log.date}, ${log.userId}, ${log.productId}, ${log.stockTypeId},
                 ${log.actionId}, ${log.quantity}, ${log.operation}, ${log.reason})
                RETURNING *
            `;

            const row = result.rows[0];
            return {
                stockLogId: row.stock_log_id,
                date: row.date,
                userId: row.user_id,
                productId: row.product_id,
                stockTypeId: row.stock_type_id,
                actionId: row.action_id,
                quantity: row.quantity,
                operation: row.operation,
                reason: row.reason,
            };
        } finally {
            client.release();
        }
    }

    async findByProductId(productId: string): Promise<Log[]> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                stock_log_id: number;
                date: Date;
                user_id: number;
                product_id: string;
                stock_type_id: number;
                action_id: number;
                quantity: number;
                operation: string;
                reason: string;
            }>`
                SELECT * FROM logs 
                WHERE product_id = ${productId}
                ORDER BY date DESC
            `;

            return result.rows.map(row => ({
                stockLogId: row.stock_log_id,
                date: row.date,
                userId: row.user_id,
                productId: row.product_id,
                stockTypeId: row.stock_type_id,
                actionId: row.action_id,
                quantity: row.quantity,
                operation: row.operation,
                reason: row.reason,
            }));
        } finally {
            client.release();
        }
    }
}