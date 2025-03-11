// Updated modules/promotions/promotion.controller.ts
import { Hono } from 'hono';
import { promotionService } from './bll/promotion.service.ts';
import {PromotionUpdateDto} from "./dto/promotion.dto.ts";

const promotionController = new Hono();

// GET /promotion
promotionController.get('/', async (c) => {
  const promotions = await promotionService.getAllPromotions();
  return c.json(promotions);
});

// GET /promotion/:promotionId
promotionController.get('/:promotionId', async (c) => {
  const promotionId = Number(c.req.param('promotionId'));
  const promo = await promotionService.getPromotionById(promotionId);
  if (!promo) {
    return c.json({ message: 'Promotion not found' }, 404);
  }
  return c.json(promo);
});

// POST /promotion
promotionController.post('/', async (c) => {
  try {
    const body = await c.req.json();
    // Transform snake_case to camelCase for the DTO
    const createDto = {
      productId: body.product_id,
      percentage: body.percentage, // Note: Using 'percentage' from DB schema
      beginDate: body.begin_date,   // Correct field name
      endDate: body.end_date,
      active: body.active
    };

    // Get the user ID from the context
    const userId = c.get("userId") || 1; // Default to 1 if not available

    const res = await promotionService.createPromotion(createDto, userId);
    return c.json(res, 201);
  } catch (error) {
    console.error("Error creating promotion:", error);
    return c.json({
      error: error instanceof Error ? error.message : "An unknown error occurred"
    }, 400);
  }
});

// PUT /promotion/:promotionId
promotionController.put('/:promotionId', async (c) => {
  try {
    const promotionId = Number(c.req.param('promotionId'));
    const body = await c.req.json();

    // Create a properly typed update DTO object
    const updateDto: PromotionUpdateDto = {};

    if (body.product_id !== undefined) updateDto.productId = body.product_id;
    if (body.percentage !== undefined) updateDto.percentage = body.percentage;
    if (body.begin_date !== undefined) updateDto.beginDate = body.begin_date;
    if (body.end_date !== undefined) updateDto.endDate = body.end_date;
    if (body.active !== undefined) updateDto.active = body.active;

    // Get the user ID from the context
    const userId = c.get("userId") || 1; // Default to 1 if not available

    await promotionService.updatePromotion(promotionId, updateDto, userId);
    return c.json({ message: 'Promotion updated' });
  } catch (error) {
    console.error("Error updating promotion:", error);
    return c.json({
      error: error instanceof Error ? error.message : "An unknown error occurred"
    }, 400);
  }
});

// DELETE /promotion/:promotionId
promotionController.delete('/:promotionId', async (c) => {
  try {
    const promotionId = Number(c.req.param('promotionId'));
    // Get the user ID from the context
    const userId = c.get("userId") || 1; // Default to 1 if not available

    await promotionService.deletePromotion(promotionId, userId);
    return c.json({ message: 'Promotion deleted' });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return c.json({
      error: error instanceof Error ? error.message : "An unknown error occurred"
    }, 400);
  }
});

export default promotionController;