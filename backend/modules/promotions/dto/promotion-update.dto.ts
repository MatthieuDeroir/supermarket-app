// modules/promotions/dto/promotion-response.dto.ts

/**
 * DTO représentant la promotion renvoyée (lecture seule).
 * Contient l'identifiant et tous les champs.
 */
export interface PromotionResponseDto {
    promotionId: number;
    productId: string;
    pourcentage: number;
    begingDate: Date;
    endDate: Date;
    active: boolean;
}
