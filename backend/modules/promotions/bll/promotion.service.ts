// modules/promotions/bll/promotion.service.ts
import promotionRepository from "../dal/promotion.repository.ts";
import { Promotion } from "../promotion.model.ts";

class PromotionService {
    async getAllPromotions(): Promise<Promotion[]> {
        return promotionRepository.findAll();
    }

    async getPromotionById(promotionId: number): Promise<Promotion | null> {
        return promotionRepository.findById(promotionId);
    }

    async createPromotion(data: Omit<Promotion, "promotionId">): Promise<void> {
        await promotionRepository.create(data);
    }

    async updatePromotion(promotionId: number, data: Partial<Promotion>): Promise<void> {
        await promotionRepository.update(promotionId, data);
    }

    async deletePromotion(promotionId: number): Promise<void> {
        await promotionRepository.deleteById(promotionId);
    }
}

export const promotionService = new PromotionService();
export default promotionService;
