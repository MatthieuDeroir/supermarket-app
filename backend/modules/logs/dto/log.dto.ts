// Log DTOs
import {BaseCreateDto, BaseResponseDto} from "../../generic.dto.ts";
import {UserResponseDto} from "../../users/dto/user.dto.ts";
import {ProductResponseDto} from "../../products/dto/product.dto.ts";

export interface LogResponseDto extends BaseResponseDto {
    id: number; // Renamed from logId
    date: Date;
    userId: number;
    productId: number;
    quantity: number;
    reason: string;
    action: string;
    stockType: string;
    stockWarehouseAfter: number;
    stockShelfBottomAfter: number;
    user?: UserResponseDto;
    product?: ProductResponseDto;
}

export interface LogCreateDto extends BaseCreateDto {
    date: Date;
    userId: number;
    productId: number;
    quantity: number;
    reason: string;
    action: string;
    stockType: string;
    stockWarehouseAfter: number;
    stockShelfBottomAfter: number;
}
