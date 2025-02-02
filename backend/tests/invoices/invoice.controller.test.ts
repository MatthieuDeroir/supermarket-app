// tests/invoice/invoice.controller.test.ts
if (typeof window === "undefined") {
    (globalThis as any).window = globalThis;
}

import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Hono } from "hono";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import invoiceController from "../../modules/invoices/invoice.controller.ts";
import invoiceService from "../../modules/invoices/bll/invoice.service.ts";
import { stub, assertSpyCalls } from "https://deno.land/std@0.192.0/testing/mock.ts";

Deno.test("GET /invoices returns all invoices", async () => {
    const fakeInvoices = [{ invoice_id: 1, user_id: 1, address_id: 1, cart_id: 1, created_at: new Date(), lines: [] }];
    const stubAll = stub(invoiceService, "getAllInvoices", () => Promise.resolve(fakeInvoices));
    const app = new Hono();
    app.route("/invoices", invoiceController);
    const res = await superdeno(app.fetch.bind(app))
        .get("/invoices")
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, fakeInvoices);
    assertSpyCalls(stubAll, 1);
    stubAll.restore();
});
