// tests/auth/auth.controller.test.ts
if (typeof window === "undefined") {
    (globalThis as any).window = globalThis;
}

import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Hono } from "hono";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import authController from "../../modules/auth/auth.controller.ts";
import authService from "../../modules/auth/bll/auth.service.ts";
import { stub, assertSpyCalls } from "https://deno.land/std@0.192.0/testing/mock.ts";

Deno.test("POST /auth/register returns created user info", async () => {
    const fakeUser = {
        user_id: 1,
        email: "test@example.com",
        first_name: "Test",
        last_name: "User",
        phone_number: "1234567890",
        role_id: 2,
        password: "hashed",
        created_at: new Date(),
        updated_at: new Date(),
    };
    const registerStub = stub(authService, "registerUser", () => Promise.resolve(fakeUser));
    const app = new Hono();
    app.route("/auth", authController);
    const res = await superdeno(app.fetch.bind(app))
        .post("/auth/register")
        .send({
            email: "test@example.com",
            password: "password",
            firstName: "Test",
            lastName: "User",
            phoneNumber: "1234567890",
            role_id: 2,
        })
        .expect("Content-Type", /application\/json/)
        .expect(201);
    assertEquals(res.body.message, "User registered successfully");
    assertEquals(res.body.user.email, "test@example.com");
    assertSpyCalls(registerStub, 1);
    registerStub.restore();
});

Deno.test("POST /auth/login returns token", async () => {
    const fakeUser = {
        user_id: 1,
        email: "test@example.com",
        password: "hashed",
        first_name: "Test",
        last_name: "User",
        phone_number: "1234567890",
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
    };
    const loginStub = stub(authService, "loginUser", () =>
        Promise.resolve({ token: "fake.jwt.token", user: fakeUser })
    );
    const app = new Hono();
    app.route("/auth", authController);
    const res = await superdeno(app.fetch.bind(app))
        .post("/auth/login")
        .send({ email: "test@example.com", password: "password" })
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body.token, "fake.jwt.token");
    loginStub.restore();
});
