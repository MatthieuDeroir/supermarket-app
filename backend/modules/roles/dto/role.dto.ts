// Role DTOs
import {BaseCreateDto, BaseResponseDto, BaseUpdateDto} from "../../generic.dto.ts";

export interface RoleResponseDto extends BaseResponseDto {
    id: number; // Renamed from roleId
    name: string;
}

export interface RoleCreateDto extends BaseCreateDto {
    name: string;
}

export interface RoleUpdateDto extends BaseUpdateDto {
    name?: string;
}
