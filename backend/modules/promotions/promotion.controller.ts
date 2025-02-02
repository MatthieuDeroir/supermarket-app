// modules/promotions/promotion.controller.ts
import { Hono } from "hono";
import { promotionService } from "./bll/promotion.service.ts";

const promotionController = new Hono();

// GET /promotion
promotionController.get("/", async (c) => {
    const promotions = await promotionService.getAllPromotions();
    return c.json(promotions);
});

// GET /promotion/:promotionId
promotionController.get("/:promotionId", async (c) => {
    const promotionId = Number(c.req.param("promotionId"));
    const promo = await promotionService.getPromotionById(promotionId);
    if (!promo) {
        return c.json({ message: "Promotion not found" }, 404);
    }
    return c.json(promo);
});

// POST /promotion
promotionController.post("/", async (c) => {
    const body = await c.req.json();
    const res = await promotionService.createPromotion(body);
    return c.json(res, 201);
});

// PUT /promotion/:promotionId
promotionController.put("/:promotionId", async (c) => {
    const promotionId = Number(c.req.param("promotionId"));
    const body = await c.req.json();
    await promotionService.updatePromotion(promotionId, body);
    return c.json({ message: "Promotion updated" });
});

// DELETE /promotion/:promotionId
promotionController.delete("/:promotionId", async (c) => {
    const promotionId = Number(c.req.param("promotionId"));
    await promotionService.deletePromotion(promotionId);
    return c.json({ message: "Promotion deleted" });
});

export default promotionController;
