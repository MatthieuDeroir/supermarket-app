// modules/stock/dal/action.repository.ts
import { getDBClient } from "../../../config/database.ts";
import { Action } from "../action.model.ts";

export class ActionRepository {
    async findAll(): Promise<Action[]> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                action_id: number;
                name: string;
                description: string;
            }>`SELECT * FROM actions`;

            return result.rows.map(row => ({
                actionId: row.action_id,
                name: row.name,
                description: row.description,
            }));
        } finally {
            client.release();
        }
    }
}