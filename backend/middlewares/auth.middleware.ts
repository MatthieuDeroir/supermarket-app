// middlewares/auth.middleware.ts
import { create, verify, decode, getNumericDate } from "djwt";
import { crypto } from "https://deno.land/std/crypto/mod.ts";

interface JWTPayload {
    exp: number;
    email: string;
}

export class AuthMiddleware {
    private secret: CryptoKey;

    constructor() {
        this.secret = "null";
    }

    async generateSecret(): Promise<void> {
        const key = new Uint8Array(64);
        crypto.getRandomValues(key);
        this.secret = await crypto.subtle.importKey(
            "raw",
            key,
            { name: "HMAC", hash: "SHA-512" },
            false,
            ["sign", "verify"]
        );
    }

    async sign(email: string): Promise<string> {
        if (!this.secret) {
            throw new Error("Secret key not initialized");
        }

        const exp = getNumericDate(60 * 60 * 2); // 2 hours
        const payload: JWTPayload = { exp, email };

        return await create(
            { alg: "HS512", typ: "JWT" },
            payload,
            this.secret
        );
    }

    decode(token: string): { header: any; payload: JWTPayload } {
        const [headerB64, payloadB64] = token.split('.');

        return {
            header: JSON.parse(atob(headerB64)),
            payload: JSON.parse(atob(payloadB64))
        };
    }

    async verify(token: string): Promise<JWTPayload> {
        if (!this.secret) {
            throw new Error("Secret key not initialized");
        }

        try {
            const payload = await verify(token, this.secret);
            return payload as JWTPayload;
        } catch (error) {
            if (error.message.includes("expired")) {
                throw new Error("Token expired");
            }
            throw new Error("Invalid token");
        }
    }
}