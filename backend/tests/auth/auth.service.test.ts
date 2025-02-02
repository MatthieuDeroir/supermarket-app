// tests/auth/auth.service.test.ts
import { assertEquals, assertRejects } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import authService from "../../modules/auth/bll/auth.service.ts";
import userRepository from "../../modules/users/dal/user.repository.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { stub, assertSpyCalls } from "https://deno.land/std@0.192.0/testing/mock.ts";
import { User } from "../../modules/users/index.ts";

Deno.test("registerUser creates a new user", async () => {
    // Stub findByEmail pour retourner null (pas d'utilisateur existant)
    const findByEmailStub = stub(userRepository, "findByEmail", () => Promise.resolve(null));
    // Stub createReturningId pour retourner un id fictif
    const createReturningIdStub = stub(userRepository, "createReturningId", (_data: Partial<User>) => Promise.resolve(1));
    // Stub findById pour retourner un utilisateur fictif
    const fakeUser: User = {
        user_id: 1,
        email: "test@example.com",
        password: "hashed",
        first_name: "Test",
        last_name: "User",
        phone_number: "1234567890",
        created_at: new Date(),
        updated_at: new Date(),
        role_id: 2,
    };
    const findByIdStub = stub(userRepository, "findById", (_pk: unknown) => Promise.resolve(fakeUser));

    const newUser = await authService.registerUser("test@example.com", "password", 2, "Test", "User", "1234567890");
    assertEquals(newUser.email, "test@example.com");
    assertEquals(newUser.first_name, "Test");

    findByEmailStub.restore();
    createReturningIdStub.restore();
    findByIdStub.restore();
});

Deno.test("registerUser fails if email exists", async () => {
    const fakeUser: User = {
        user_id: 1,
        email: "test@example.com",
        password: "hashed",
        first_name: "Test",
        last_name: "User",
        phone_number: "1234567890",
        created_at: new Date(),
        updated_at: new Date(),
        role_id: 2,
    };
    const findByEmailStub = stub(userRepository, "findByEmail", () => Promise.resolve(fakeUser));
    await assertRejects(
        () => authService.registerUser("test@example.com", "password", 2),
        Error,
        "User with that email already exists."
    );
    findByEmailStub.restore();
});

Deno.test("loginUser returns token and user when credentials are valid", async () => {
    // Créez un utilisateur fictif avec mot de passe hashé
    const hashed = await bcrypt.hash("password");
    const fakeUser: User = {
        user_id: 1,
        email: "test@example.com",
        password: hashed,
        first_name: "Test",
        last_name: "User",
        phone_number: "1234567890",
        created_at: new Date(),
        updated_at: new Date(),
        role_id: 2,
    };
    const findByEmailStub = stub(userRepository, "findByEmail", () => Promise.resolve(fakeUser));
    const result = await authService.loginUser("test@example.com", "password");
    // Vérifie que le token est une chaîne non vide et que l'utilisateur correspond
    if (typeof result.token !== "string" || result.token.length === 0) {
        throw new Error("Token not generated");
    }
    assertEquals(result.user.email, "test@example.com");
    findByEmailStub.restore();
});

Deno.test("loginUser fails with wrong password", async () => {
    const hashed = await bcrypt.hash("password");
    const fakeUser: User = {
        user_id: 1,
        email: "test@example.com",
        password: hashed,
        first_name: "Test",
        last_name: "User",
        phone_number: "1234567890",
        created_at: new Date(),
        updated_at: new Date(),
        role_id: 2,
    };
    const findByEmailStub = stub(userRepository, "findByEmail", () => Promise.resolve(fakeUser));
    await assertRejects(
        () => authService.loginUser("test@example.com", "wrongpassword"),
        Error,
        "Invalid email or password."
    );
    findByEmailStub.restore();
});
