import { ProductResponseDto } from "../../products/dto/product.dto.ts";

export interface FavoriteResponseDto {
    id: number;
    userId: number;
    productId: number;
    createdAt: Date;
    product?: ProductResponseDto; // Optional product details
}

export interface FavoriteCreateDto {
    userId: number;
    productId: number;
}
