// modules/promotions/dal/promotion.repository.ts
import db from "../../../config/database.ts";
import { GenericRepository } from "../../generic.repository.ts";
import { Promotion } from "../promotion.model.ts";

export class PromotionRepository extends GenericRepository<Promotion> {
    constructor() {
        super({
            tableName: "promotions",
            primaryKey: "promotion_id",
        });
    }

    async createPromotion(data: Omit<Promotion, "promotionId">): Promise<number> {
        const client = db.getClient();
        const columns = Object.keys(data);
        const values = Object.values(data);

        const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
        const query = `
            INSERT INTO promotions (${columns.join(", ")})
            VALUES (${placeholders})
        `;
        
        const result = await client.queryObject<{ promotion_id: number }>({
            text: query,
            args: values,
        });
        return result.rows[0].promotion_id;
    }
}

const promotionRepository = new PromotionRepository();
export default promotionRepository;
