// modules/promotions/dto/promotion-update.dto.ts

/**
 * DTO pour la mise à jour d'une promotion.
 * Tous les champs sont facultatifs, car on peut en modifier un seul à la fois.
 */
export interface PromotionUpdateDto {
    productId?: string;
    pourcentage?: number;
    begingDate?: Date;
    endDate?: Date;
    active?: boolean;
}
