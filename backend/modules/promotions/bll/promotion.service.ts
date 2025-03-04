// modules/promotions/bll/promotion.service.ts
import promotionRepository from '../dal/promotion.repository.ts';
import { Promotion } from '../promotion.model.ts';

class PromotionService {
  async getAllPromotions(): Promise<Promotion[]> {
    return await promotionRepository.findAll();
  }

  async getPromotionById(promotionId: number): Promise<Promotion | null> {
    return await promotionRepository.findById(promotionId);
  }

  async createPromotion(data: Omit<Promotion, 'promotion_id'>): Promise<Promotion | null> {
    const id = await promotionRepository.createPromotion(data);
    return await this.getPromotionById(id);
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
