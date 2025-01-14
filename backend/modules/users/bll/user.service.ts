// modules/users/bll/user.service.ts

import { UserRepository } from "../dal/user.repository.ts";
import { User } from "../user.model.ts";

// Import bcrypt from deps
import { bcryptHash, bcryptCompare, bcryptGenSalt } from "../../../deps.ts";

// Example DTOs
import { UserCreateDto } from "../dto/user-create.dto.ts";
import { UserLoginDto } from "../dto/user-login.dto.ts";
import { UserUpdateDto } from "../dto/user-update.dto.ts";

export class UserService {
    constructor(private userRepo: UserRepository) {}

    /**
     * Create a new user account
     */
    async createUser(dto: UserCreateDto): Promise<User> {
        // Check if email already exists
        const existing = await this.userRepo.findByEmail(dto.email);
        if (existing) {
            throw new Error("Email already registered");
        }

        // Hash the password using bcrypt
        // e.g. salt rounds = 10 (adjust as needed)
        // Option A: pass an integer for salt rounds (commonly 8-12)
        const salt = await bcryptGenSalt(10);
        const hashedPassword = await bcryptHash(dto.password, salt);

        const newUser: User = {
            userId: 0,
            email: dto.email,
            password: hashedPassword,     // store hashed password
            firstName: dto.firstName,
            lastName: dto.lastName,
            phoneNumber: dto.phoneNumber,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            roleId: 1, // e.g. default role = 1
        };

        return await this.userRepo.createUser(newUser);
    }

    /**
     * User login: check email & password
     */
    async login(dto: UserLoginDto): Promise<User> {
        const user = await this.userRepo.findByEmail(dto.email);
        if (!user) {
            throw new Error("User not found");
        }
        // Compare hashed password with the incoming one
        const isMatch = await bcryptCompare(dto.password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }

        return user; // potentially generate a JWT token here
    }

    /**
     * Update user info (or soft-delete)
     */
    async updateUser(dto: UserUpdateDto): Promise<User> {
        const user = await this.userRepo.findById(dto.userId);
        if (!user) {
            throw new Error("User not found");
        }

        // If user wants to change their password, we should hash the new one
        // (You can add a separate field in your dto e.g. `newPassword`)
        // For now, we just update firstName, lastName, phoneNumber
        user.firstName = dto.firstName ?? user.firstName;
        user.lastName = dto.lastName ?? user.lastName;
        user.phoneNumber = dto.phoneNumber ?? user.phoneNumber;
        user.updatedAt = new Date();

        // If there's a param for "delete", e.g. user.deletedAt = new Date();

        const updated = await this.userRepo.updateUser(user);
        if (!updated) {
            throw new Error("Update failed");
        }
        return updated;
    }

    /**
     * Get user by ID
     */
    async getUserById(userId: number): Promise<User | null> {
        return this.userRepo.findById(userId);
    }
}
