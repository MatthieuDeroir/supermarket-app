// tests/user/user.controller.test.ts
if (typeof window === "undefined") {
    (globalThis as any).window = globalThis;
}

import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Hono } from "hono";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import userController from "../../modules/users/user.controller.ts";
import userService from "../../modules/users/bll/user.service.ts";
import { stub, assertSpyCalls } from "https://deno.land/std@0.192.0/testing/mock.ts";

Deno.test("GET /user returns all users", async () => {
    const fakeUsers = [{
        user_id: 1,
        email: "user@example.com",
        first_name: "First",
        last_name: "Last",
        phone_number: "1234567890",
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
    }];
    const stubAll = stub(userService, "getAllUsers", () => Promise.resolve(fakeUsers));
    const app = new Hono();
    app.route("/user", userController);
    const res = await superdeno(app.fetch.bind(app))
        .get("/user")
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, fakeUsers);
    assertSpyCalls(stubAll, 1);
    stubAll.restore();
});
