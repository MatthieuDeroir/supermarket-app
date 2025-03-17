
// CartLine DTOs
import {ProductResponseDto} from "../../products/dto/product.dto.ts";
import {BaseCreateDto, BaseResponseDto, BaseUpdateDto} from "../../generic.dto.ts";

export interface CartLineResponseDto extends BaseResponseDto {
    id: number; // Renamed from cartLineId
    productId: number;
    quantity: number;
    cartId: number;
    createdAt: Date;
    product?: ProductResponseDto;
}

export interface CartLineCreateDto extends BaseCreateDto {
    productId: number;
    quantity: number;
    cartId: number;
}

export interface CartLineUpdateDto extends BaseUpdateDto {
    quantity?: number;
}