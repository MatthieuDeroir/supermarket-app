// modules/logs/dal/log.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { Log } from "../log.model.ts";
import db from "../../../config/database.ts";

export class LogRepository extends GenericRepository<Log> {
    constructor() {
        super({
            tableName: "logs",
            primaryKey: "log_id",
        });
    }

    async findByProductId(productId: number): Promise<Log[]> {
        const client = db.getClient();
        const query = `
            SELECT *
            FROM logs
            WHERE product_id = $1
        `;
        const result = await client.queryObject<Log>({
            text: query,
            args: [productId],
        });
        return result.rows;
    }

    async findByUserId(userId: number): Promise<Log[]> {
        const client = db.getClient();
        const query = `
            SELECT *
            FROM logs
            WHERE user_id = $1
        `;
        const result = await client.queryObject<Log>({
            text: query,
            args: [userId],
        });
        return result.rows;
    }

    async findLogsForProductBetween(productId: number, startDate: Date, endDate: Date): Promise<Log[]> {
        const client = db.getClient();
        const query = `
            SELECT *
            FROM logs
            WHERE product_id = $1
              AND "date" >= $2
              AND "date" <= $3
            ORDER BY "date" ASC
        `;
        const result = await client.queryObject<Log>({
            text: query,
            args: [productId, startDate, endDate],
        });
        return result.rows;
    }

    async findLastLogBefore(productId: number, beforeDate: Date): Promise<Log | null> {
        const client = db.getClient();
        const query = `
            SELECT *
            FROM logs
            WHERE product_id = $1
              AND "date" < $2
            ORDER BY "date" DESC
            LIMIT 1
        `;
        const result = await client.queryObject<Log>({
            text: query,
            args: [productId, beforeDate],
        });
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    }
}

const logRepository = new LogRepository();
export default logRepository;