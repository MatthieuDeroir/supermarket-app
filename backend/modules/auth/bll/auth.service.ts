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

    // modules/auth/auth.service.ts (extrait)
    async registerUser(
        email: string,
        plainPassword: string,
        role_id: number,          // Qu’on peut rendre optionnel si on a un default
        firstName?: string,
        lastName?: string,
        phoneNumber?: string
    ): Promise<User> {
        // 1. Vérifier si l’utilisateur existe déjà
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("User with that email already exists.");
        }

        // 2. Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(plainPassword);

        // 3. Créer l’utilisateur
        // On remplit tous les champs obligatoires (ou on met null / '')
        const now = new Date();

        const userId = await userRepository.createReturningId({
            email,
            password: hashedPassword,
            first_name: firstName || "",
            last_name: lastName || "",
            phone_number: phoneNumber || "",
            created_at: now,
            updated_at: now,
            role_id: role_id,  // ex. 2 si "User" par défaut
        });

        const newUser = await userRepository.findById(userId);
        if (!newUser) {
            throw new Error("Failed to create user.");
        }

        return newUser;
    }


    async loginUser(email: string, plainPassword: string): Promise<{ token: string; user: User }> {
        // 1. Vérifier que l'utilisateur existe
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid email or password.");
        }

        // 2. Comparer le mot de passe
        const isValidPassword = await bcrypt.compare(plainPassword, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid email or password.");
        }

        // 3. Construire le JWT
        const now = Math.floor(Date.now() / 1000);
        const header: Header = { alg: "HS256", typ: "JWT" };
        const payload = {
            userId: user.user_id,
            iat: now,
            exp: now + this.jwtExpiration, // par ex. +1 heure
        };

        // 4. Récupérer la clé pour signer le token
        const key = await this.keyPromise;

        // 5. Signer le token
        const token = await create(header, payload, key);

        // Retourner le token et l'utilisateur complet
        return { token, user };
    }

}

// Usage
const jwtSecret = Deno.env.get("JWT_SECRET") ?? "some_default_secret";
const authService = new AuthService({
    jwtSecret,
    jwtExpiration: 3600, // 1 hour in seconds
});

export default authService;
