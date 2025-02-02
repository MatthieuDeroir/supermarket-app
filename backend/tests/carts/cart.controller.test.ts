// tests/carts/cart.controller.test.ts
if (typeof window === "undefined") {
    (globalThis as any).window = globalThis;
}

import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Hono } from "hono";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import cartController from "../../modules/carts/cart.controller.ts";
import cartService, { CartWithLines } from "../../modules/carts/bll/cart.service.ts";
import { stub, assertSpyCalls } from "https://deno.land/std@0.192.0/testing/mock.ts";
import { Cart } from "../../modules/carts/cart.model.ts";

// Ici, le type CartWithLines attend des clés camelCase (par exemple createdAt)
const fakeCarts = [{
  cartId: 1,
  userId: 1,
  payed: false,
  createdAt: new Date(),
  payedAt: null,
  lines: [],
}];

Deno.test("GET /carts returns all carts", async () => {
    const stubAll = stub(cartService, "getAllCarts", () => Promise.resolve(fakeCarts));
    const app = new Hono();
    app.route("/carts", cartController);
    const res = await superdeno(app.fetch.bind(app))
        .get("/carts")
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, fakeCarts);
    assertSpyCalls(stubAll, 1);
    stubAll.restore();
});
