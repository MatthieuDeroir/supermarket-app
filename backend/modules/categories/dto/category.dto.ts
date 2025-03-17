
// Category DTOs
import {BaseCreateDto, BaseResponseDto, BaseUpdateDto} from "../../generic.dto.ts";

export interface CategoryResponseDto extends BaseResponseDto {
    id: number; // Renamed from categoryId
    taxValue: number;
    description: string;
}

export interface CategoryCreateDto extends BaseCreateDto {
    taxValue: number;
    description: string;
}

export interface CategoryUpdateDto extends BaseUpdateDto {
    taxValue?: number;
    description?: string;
}