
// Promotion DTOs
import {BaseCreateDto, BaseResponseDto, BaseUpdateDto} from "../../generic.dto.ts";

export interface PromotionResponseDto extends BaseResponseDto {
    id: number; // Renamed from promotionId
    productId: number;
    percentage: number; // Renamed from pourcentage for English consistency
    beginDate: Date; // Fixed typo from begingDate
    endDate: Date;
    active: boolean;
}

export interface PromotionCreateDto extends BaseCreateDto {
    productId: number;
    percentage: number;
    beginDate: Date;
    endDate: Date;
    active: boolean;
}

export interface PromotionUpdateDto extends BaseUpdateDto {
    productId?: number;
    percentage?: number;
    beginDate?: Date;
    endDate?: Date;
    active?: boolean;
}
