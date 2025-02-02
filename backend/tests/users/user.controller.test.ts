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
import { User } from "../../modules/users/index.ts";

// Exemple : utilisateur en camelCase (y compris le champ password)
const fakeUsers = [{
    userId: 1,
    email: "user@example.com",
    password: "hashed",
    firstName: "First",
    lastName: "Last",
    phoneNumber: "1234567890",
    roleId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
}] as unknown as User[];

Deno.test("GET /user returns all users", async () => {
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
