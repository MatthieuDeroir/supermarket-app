// modules/auth/auth.controller.ts
import { Hono } from "hono";
import authService from "./bll/auth.service.ts";

const authController = new Hono();

/**
 * POST /auth/register
 * Body:
 * {
 *   "email": string,
 *   "password": string,
 *   "firstName"?: string,
 *   "lastName"?: string,
 *   "phoneNumber"?: string,
 *   "role_id"?: number
 * }
 */
authController.post("/register", async (c) => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            role_id
        } = await c.req.json();

        if (!email || !password) {
            return c.json({ error: "Missing email or password" }, 400);
        }

        // Valeur par défaut si role_id n’est pas fourni
        const finalRole = role_id ?? 2;

        // Appel du service
        const newUser = await authService.registerUser(
            email,
            password,
            finalRole,
            firstName,
            lastName,
            phoneNumber,
        );

        // On ne renvoie pas le password, ni d’autres infos sensibles
        return c.json({
            message: "User registered successfully",
            user: {
                user_id: newUser.user_id,
                email: newUser.email,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                phone_number: newUser.phone_number,
                role_id: newUser.role_id,
            },
        }, 201);

    } catch (error) {
        return c.json({ error: error.message ?? String(error) }, 400);
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
        return c.json({ error: error.message ?? String(error) }, 401);
    }
});

export default authController;
