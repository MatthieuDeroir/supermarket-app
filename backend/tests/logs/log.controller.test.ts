// tests/log/log.controller.test.ts
import {Log} from "../../modules/logs/log.model.ts";

if (typeof window === "undefined") {
    (globalThis as any).window = globalThis;
}
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Hono } from "hono";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import logController from "../../modules/logs/log.controller.ts";
import logService from "../../modules/logs/bll/log.service.ts";
import { stub, assertSpyCalls } from "https://deno.land/std@0.192.0/testing/mock.ts";

// Exemple : log en camelCase (correspond à l'interface Log)
const fakeLogs = [{
    logId: 1,
    date: new Date(),
    userId: 1,
    productId: "1",
    quantity: 10,
    reason: "Test",
    action: "CREATE",
    stockWarehouseAfter: 100,
    stockShelfBottomAfter: 50,
    stockType: "WAREHOUSE", // Ajoutez cette propriété si elle est requise
}] as unknown as Log[];

Deno.test("GET /log returns all logs", async () => {
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
