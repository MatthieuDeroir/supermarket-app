
// Product DTOs
import {PromotionResponseDto} from "../../promotions/dto/promotion.dto.ts";
import {BaseCreateDto, BaseResponseDto, BaseUpdateDto} from "../../generic.dto.ts";

export interface ProductResponseDto extends BaseResponseDto {
    id: number; // Renamed from productId
    ean: string;
    name: string;
    brand: string;
    description: string;
    picture: string;
    nutritionalInformation: string;
    price: number;
    stockWarehouse: number;
    stockShelfBottom: number;
    minimumStock: number;
    minimumShelfStock: number;
    categoryId: number;
    // Include promotion information if applicable
    promotion?: PromotionResponseDto | null;
    finalPrice?: number;
}

export interface ProductCreateDto extends BaseCreateDto {
    ean: string;
    name: string;
    brand: string;
    description: string;
    picture: string;
    nutritionalInformation: string;
    price: number;
    stockWarehouse: number;
    stockShelfBottom: number;
    minimumStock: number;
    minimumShelfStock: number;
    categoryId: number;
}

export interface ProductUpdateDto extends BaseUpdateDto {
    ean?: string;
    name?: string;
    brand?: string;
    description?: string;
    picture?: string;
    nutritionalInformation?: string;
    price?: number;
    stockWarehouse?: number;
    stockShelfBottom?: number;
    minimumStock?: number;
    minimumShelfStock?: number;
    categoryId?: number;
}
