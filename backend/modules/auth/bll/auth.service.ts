// modules/auth/auth.service.ts
import { create, Header } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { createHmacKeyFromString } from "../../../utils/cryptoKeyHelper.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import userRepository from "../../users/dal/user.repository.ts";
import { User } from "../../users/index.ts";

interface AuthServiceConfig {
    jwtSecret: string;
    jwtExpiration?: number; // in seconds, e.g. 3600 for 1h
}

export class AuthService {
    private keyPromise: Promise<CryptoKey>;
    private jwtExpiration: number;

    constructor(config: AuthServiceConfig) {
        // 1) convert the string secret to a CryptoKey for HMAC with HS256
        this.keyPromise = createHmacKeyFromString(config.jwtSecret, "HS256");
        this.jwtExpiration = config.jwtExpiration ?? 3600;
    }

    async registerUser(email: string, plainPassword: string): Promise<User> {
        // 1. Check if user exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("User with that email already exists.");
        }

        // 2. Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(plainPassword);

        // 3. Create user in DB
        const userId = await userRepository.createReturningId({
            email,
            password: hashedPassword,
        });

        const newUser = await userRepository.findById(userId);
        if (!newUser) {
            throw new Error("Failed to create user.");
        }

        return newUser;
    }

    async loginUser(email: string, plainPassword: string): Promise<string> {
        // 1. Check if user exists
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid email or password.");
        }

        // 2. Compare password
        const isValidPassword = await bcrypt.compare(plainPassword, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid email or password.");
        }

        // 3. Build JWT
        const now = Math.floor(Date.now() / 1000);
        const header: Header = { alg: "HS256", typ: "JWT" };
        const payload = {
            userId: user.user_id,
            iat: now,
            exp: now + this.jwtExpiration, // e.g. +1 hour
        };

        // 4. Convert the key Promise => CryptoKey
        const key = await this.keyPromise;

        // 5. Sign token
        const jwt = await create(header, payload, key);
        return jwt;
    }
}

// Usage
const jwtSecret = Deno.env.get("JWT_SECRET") ?? "some_default_secret";
const authService = new AuthService({
    jwtSecret,
    jwtExpiration: 3600, // 1 hour in seconds
});

export default authService;
