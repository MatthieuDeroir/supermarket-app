// tests/promotion/promotion.controller.test.ts
if (typeof window === "undefined") {
    (globalThis as any).window = globalThis;
}
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Hono } from "hono";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import promotionController from "../../modules/promotions/promotion.controller.ts";
import promotionService from "../../modules/promotions/bll/promotion.service.ts";
import { stub, assertSpyCalls } from "https://deno.land/std@0.192.0/testing/mock.ts";
import { Promotion } from "../../modules/promotions/promotion.model.ts";

// Exemple : promotion en camelCase
const fakePromotions = [{
    promotionId: 1,
    productId: 1,
    pourcentage: 10,
    begingDate: new Date(),
    endDate: new Date(),
    active: true,
}] as unknown as Promotion[];

Deno.test("GET /promotion returns all promotions", async () => {
    const stubAll = stub(promotionService, "getAllPromotions", () => Promise.resolve(fakePromotions));
    const app = new Hono();
    app.route("/promotion", promotionController);
    const res = await superdeno(app.fetch.bind(app))
        .get("/promotion")
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, fakePromotions);
    assertSpyCalls(stubAll, 1);
    stubAll.restore();
});
