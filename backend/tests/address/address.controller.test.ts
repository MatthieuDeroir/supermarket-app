// tests/address/address.controller.test.ts
if (typeof window === "undefined") {
    (globalThis as any).window = globalThis;
}

import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Hono } from "hono";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import addressController from "../../modules/addresses/address.controller.ts";
import addressService from "../../modules/addresses/bll/address.service.ts";
import { stub, assertSpyCalls } from "https://deno.land/std@0.192.0/testing/mock.ts";
import { Address } from "../../modules/addresses/address.model.ts";

Deno.test("GET /address returns all addresses", async () => {
    const fakeAddresses: Address[] = [{
        address_id: 1,
        user_id: 1,
        address_line1: "1 rue",
        address_line2: "",
        city: "Paris",
        zip_code: "75000",
        country: "France",
    }];
    const stubAll = stub(addressService, "getAllAddress", () => Promise.resolve(fakeAddresses));
    const app = new Hono();
    app.route("/address", addressController);
    const res = await superdeno(app.fetch.bind(app))
        .get("/address")
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, fakeAddresses);
    assertSpyCalls(stubAll, 1);
    stubAll.restore();
});
