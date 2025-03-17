// User DTOs
import {BaseResponseDto, BaseUpdateDto, BaseCreateDto} from "../../generic.dto.ts";

export interface UserResponseDto extends BaseResponseDto {
    id: number; // Renamed from userId for consistency
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    roleId: number;
}

export interface UserCreateDto extends BaseCreateDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    roleId?: number; // Optional, default to regular user role
}

export interface UserUpdateDto extends BaseUpdateDto {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    password?: string;
}

export interface UserLoginDto {
    email: string;
    password: string;
}