// modules/users/user.controller.ts
import type { Context } from "../../deps.ts";
import { UserRepository } from "./dal/user.repository.ts";
import { UserService } from "./bll/user.service.ts";
import { UserCreateDto } from "./dto/user-create.dto.ts";
import { UserLoginDto } from "./dto/user-login.dto.ts";
import { UserUpdateDto } from "./dto/user-update.dto.ts";
import { UserResponseDto } from "./dto/user-response.dto.ts";

const repo = new UserRepository();
const service = new UserService(repo);

export async function registerHandler(c: Context) {
    try {
        const body = await c.req.json();
        const dto = body as UserCreateDto;
        const user = await service.createUser(dto);

        // On formate la réponse (UserResponseDto)
        const response: UserResponseDto = {
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
        };

        return c.json(response, 201);
    } catch (err) {
        if (err instanceof Error) {
            return c.text(err.message, 400);
        } else {
            return c.text("Unknown error", 400);
        }
    }

}

export async function loginHandler(c: Context) {
    try {
        const body = await c.req.json();
        const dto = body as UserLoginDto;
        const user = await service.login(dto);

        const response: UserResponseDto = {
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
        };
        return c.json(response);
    } catch (err) {
        if (err instanceof Error) {
            return c.text(err.message, 400);
        } else {
            return c.text("Unknown error", 400);
        }
    }

}

export async function updateUserHandler(c: Context) {
    try {
        const body = await c.req.json();
        const dto = body as UserUpdateDto;
        const user = await service.updateUser(dto);

        const response: UserResponseDto = {
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
        };
        return c.json(response);
    } catch (err) {
        if (err instanceof Error) {
            return c.text(err.message, 400);
        } else {
            return c.text("Unknown error", 400);
        }
    }

}

export async function getUserHandler(c: Context) {
    const userId = parseInt(c.req.param("id"), 10);
    const user = await service.getUserById(userId);
    if (!user) {
        return c.text("Not found", 404);
    }
    const response: UserResponseDto = {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
    };
    return c.json(response);
}
