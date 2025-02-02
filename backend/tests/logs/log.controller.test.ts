// tests/log/log.controller.test.ts
if (typeof window === "undefined") {
    (globalThis as any).window = globalThis;
}

import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Hono } from "hono";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import logController from "../../modules/logs/log.controller.ts";
import logService from "../../modules/logs/bll/log.service.ts";
import { stub, assertSpyCalls } from "https://deno.land/std@0.192.0/testing/mock.ts";

Deno.test("GET /log returns all logs", async () => {
    const fakeLogs = [{ log_id: 1, date: new Date(), user_id: 1, product_id: "1", quantity: 10, reason: "Test", action: "CREATE", stock_warehouse_after: 100, stock_shelf_bottom_after: 50 }];
    const stubAll = stub(logService, "getAllLogs", () => Promise.resolve(fakeLogs));
    const app = new Hono();
    app.route("/log", logController);
    const res = await superdeno(app.fetch.bind(app))
        .get("/log")
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, fakeLogs);
    assertSpyCalls(stubAll, 1);
    stubAll.restore();
});
