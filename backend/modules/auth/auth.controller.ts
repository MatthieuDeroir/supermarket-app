// modules/auth/auth.controller.ts
import { Hono } from "hono";
import authService from "./bll/auth.service.ts";

const authController = new Hono();

/**
 * POST /auth/register
 * Body: { "email": string, "password": string }
 */
authController.post("/register", async (c) => {
    try {
        const { email, password } = await c.req.json();
        if (!email || !password) {
            return c.json({ error: "Missing fields" }, 400);
        }

        // Call service
        const newUser = await authService.registerUser(email, password);

        // Return the newly created user (or partial info)
        // Typically you do NOT return the hashed password
        return c.json({
            message: "User registered successfully",
            user: {
                user_id: newUser.user_id,
                email: newUser.email,
            }
        }, 201);

    } catch (error) {
        return c.json({ error: error }, 400);
    }
});

/**
 * POST /auth/login
 * Body: { "email": string, "password": string }
 */
authController.post("/login", async (c) => {
    try {
        const { email, password } = await c.req.json();
        if (!email || !password) {
            return c.json({ error: "Missing fields" }, 400);
        }

        const token = await authService.loginUser(email, password);
        return c.json({ token }, 200);

    } catch (error) {
        return c.json({ error: error }, 401);
    }
});

export default authController;
