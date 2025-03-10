// modules/promotions/bll/promotion.service.ts
import promotionRepository from "../dal/promotion.repository.ts";
import productRepository from "../../products/dal/product.repository.ts";
import { Promotion } from "../promotion.model.ts";
import { PromotionResponseDto, PromotionCreateDto, PromotionUpdateDto } from "../dto/promotion.dto.ts";
import logService from "../../logs/bll/log.service.ts";
import { ActionTypeEnum } from "../../../enums/actionTypeEnum.ts";
import { StockTypeEnum } from "../../../enums/stockTypeEnum.ts";

class PromotionService {
  async getAllPromotions(): Promise<PromotionResponseDto[]> {
    const promotions = await promotionRepository.findAll();
    return promotions.map(this.mapToResponseDto);
  }

  async getPromotionById(promotionId: number): Promise<PromotionResponseDto | null> {
    const promotion = await promotionRepository.findById(promotionId);
    if (!promotion) return null;
    return this.mapToResponseDto(promotion);
  }

  async createPromotion(data: PromotionCreateDto, userId: number): Promise<PromotionResponseDto> {
    // Validate product exists
    const product = await productRepository.findById(data.productId);
    if (!product) {
      throw new Error(`Product with ID ${data.productId} not found`);
    }

    // Check if there's already an active promotion for this product
    const existingPromotion = await promotionRepository.findActivePromotionForProduct(data.productId);
    if (existingPromotion && existingPromotion.active) {
      throw new Error(`An active promotion already exists for product ${data.productId}`);
    }

    // Create the promotion
    const id = await promotionRepository.createPromotion(data);
    const newPromotion = await promotionRepository.findById(id);

    if (!newPromotion) {
      throw new Error("Failed to create promotion");
    }

    // Log the creation
    await logService.createLog({
      date: new Date(),
      userId: userId,
      productId: data.productId,
      quantity: 0,
      reason: `Created promotion of ${data.percentage}% for product ${data.productId}`,
      action: ActionTypeEnum.CREATE,
      stockType: StockTypeEnum.WAREHOUSE, // Not really relevant for promotions
      stockWarehouseAfter: product.stock_warehouse,
      stockShelfBottomAfter: product.stock_shelf_bottom
    });

    return this.mapToResponseDto(newPromotion);
  }

  async updatePromotion(promotionId: number, data: PromotionUpdateDto, userId: number): Promise<void> {
    const promotion = await promotionRepository.findById(promotionId);
    if (!promotion) {
      throw new Error(`Promotion with ID ${promotionId} not found`);
    }

    // Prepare data for update - convert from camelCase DTO to snake_case for DB
    const updateData: Partial<Promotion> = {};

    if (data.productId !== undefined) updateData.product_id = data.productId;
    if (data.percentage !== undefined) updateData.percentage = data.percentage;
    if (data.beginDate !== undefined) updateData.begin_date = data.beginDate;
    if (data.endDate !== undefined) updateData.end_date = data.endDate;
    if (data.active !== undefined) updateData.active = data.active;

    await promotionRepository.update(promotionId, updateData);

    // Log the update
    if (Object.keys(updateData).length > 0) {
      const product = await productRepository.findById(promotion.product_id);
      if (product) {
        await logService.createLog({
          date: new Date(),
          userId: userId,
          productId: promotion.product_id,
          quantity: 0,
          reason: `Updated promotion ${promotionId} for product ${promotion.product_id}`,
          action: ActionTypeEnum.UPDATE,
          stockType: StockTypeEnum.WAREHOUSE, // Not really relevant for promotions
          stockWarehouseAfter: product.stock_warehouse,
          stockShelfBottomAfter: product.stock_shelf_bottom
        });
      }
    }
  }

  async deletePromotion(promotionId: number, userId: number): Promise<void> {
    const promotion = await promotionRepository.findById(promotionId);
    if (!promotion) {
      throw new Error(`Promotion with ID ${promotionId} not found`);
    }

    await promotionRepository.deleteById(promotionId);

    // Log the deletion
    const product = await productRepository.findById(promotion.product_id);
    if (product) {
      await logService.createLog({
        date: new Date(),
        userId: userId,
        productId: promotion.product_id,
        quantity: 0,
        reason: `Deleted promotion ${promotionId} for product ${promotion.product_id}`,
        action: ActionTypeEnum.DELETE,
        stockType: StockTypeEnum.WAREHOUSE, // Not really relevant for promotions
        stockWarehouseAfter: product.stock_warehouse,
        stockShelfBottomAfter: product.stock_shelf_bottom
      });
    }
  }

  async getActivePromotionForProduct(productId: number): Promise<PromotionResponseDto | null> {
    const promotion = await promotionRepository.findActivePromotionForProduct(productId);
    if (!promotion) return null;
    return this.mapToResponseDto(promotion);
  }

  async deactivateExpiredPromotions(): Promise<number> {
    return await promotionRepository.deactivateExpiredPromotions();
  }

  async getProductPriceWithPromotion(productId: number): Promise<{ originalPrice: number; discountedPrice: number | null; promotion: PromotionResponseDto | null }> {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const promotion = await promotionRepository.findActivePromotionForProduct(productId);
    const originalPrice = product.price;

    if (!promotion) {
      return {
        originalPrice,
        discountedPrice: null,
        promotion: null
      };
    }

    const discountMultiplier = (100 - promotion.percentage) / 100;
    const discountedPrice = originalPrice * discountMultiplier;

    return {
      originalPrice,
      discountedPrice: parseFloat(discountedPrice.toFixed(2)),
      promotion: this.mapToResponseDto(promotion)
    };
  }

  // Helper method to map DB model to response DTO
  private mapToResponseDto(promotion: Promotion): PromotionResponseDto {
    return {
      id: promotion.promotion_id,
      productId: promotion.product_id,
      percentage: promotion.percentage,
      beginDate: promotion.begin_date,
      endDate: promotion.end_date,
      active: promotion.active
    };
  }
}

export const promotionService = new PromotionService();
export default promotionService;