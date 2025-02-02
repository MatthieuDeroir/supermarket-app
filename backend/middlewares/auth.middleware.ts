// auth.middleware.ts
import type { Context, Next } from "hono";
import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { createHmacKeyFromString } from "../utils/cryptoKeyHelper.ts";

const secretStr = Deno.env.get("JWT_SECRET") ?? "NO_SECRET";
const keyPromise = createHmacKeyFromString(secretStr, "HS256");

export const authMiddleware = async (c: Context, next: Next) => {
    try {
        const authHeader = c.req.header("Authorization");
        if (!authHeader) {
            return c.json({ error: "Unauthorized: No Auth header" }, 401);
        }

        const [bearer, token] = authHeader.split(" ");
        if (bearer !== "Bearer" || !token) {
            return c.json({ error: "Unauthorized: Malformed header" }, 401);
        }

        // Convert the promise to a CryptoKey
        const key = await keyPromise;

        const payload = await verify(token, key);
        // par exemple, le userId qu'on a mis dans le payload
        const userId = payload.userId;

        if (!userId) {
            return c.json({ error: "Unauthorized: Missing userId" }, 401);
        }

        // on stocke le userId dans le contexte
        c.set("userId", userId);

        await next();
    } catch (error) {
        return c.json({ error: `Unauthorized: ${error}` }, 401);
    }
};
