import { sign, verify, decode } from '../deps.ts';
import {UserLoginDto} from '../modules/users/index.ts';

// Secret key for JWT signing - in production use env variable
const SECRET_KEY = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
);

export async function generateToken(User: UserLoginDto) {
    const payload = {
        email: User.email,
        exp: Date.now() / 1000 + 24 * 60 * 60, // 24 hours
    };
    return await sign(payload, SECRET_KEY);
}

export const verifyJwt = (token: string) => {
    return verify(token, SECRET_KEY);
};

export const decodeJwt = (token: string) => {
    return decode(token);
};

