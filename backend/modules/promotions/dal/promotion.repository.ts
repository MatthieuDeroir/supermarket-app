// modules/promotions/dal/promotion.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { Promotion } from "../promotion.model.ts";

export class PromotionRepository extends GenericRepository<Promotion> {
    constructor() {
        super({
            tableName: "promotions",
            primaryKey: "promotion_id",
        });
    }
}

const promotionRepository = new PromotionRepository();
export default promotionRepository;
