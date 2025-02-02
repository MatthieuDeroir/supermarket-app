// tests/role/role.controller.test.ts
if (typeof window === "undefined") {
    (globalThis as any).window = globalThis;
}

import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Hono } from "hono";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import roleController from "../../modules/roles/role.controller.ts";
import roleService from "../../modules/roles/bll/role.service.ts";
import { stub, assertSpyCalls } from "https://deno.land/std@0.192.0/testing/mock.ts";

Deno.test("GET /role returns all roles", async () => {
    const fakeRoles = [{ role_id: 1, name: "Admin" }, { role_id: 2, name: "User" }];
    const stubAll = stub(roleService, "getAllRoles", () => Promise.resolve(fakeRoles));
    const app = new Hono();
    app.route("/role", roleController);
    const res = await superdeno(app.fetch.bind(app))
        .get("/role")
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, fakeRoles);
    assertSpyCalls(stubAll, 1);
    stubAll.restore();
});
