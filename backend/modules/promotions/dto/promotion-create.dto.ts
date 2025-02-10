// modules/promotions/dto/promotion-create.dto.ts

/**
 * DTO pour la création d'une promotion.
 * On ne met pas promotionId puisqu'il est auto-généré.
 */
export interface PromotionCreateDto {
    productId: string;      // Identifiant produit
    pourcentage: number;    // Pourcentage de réduction
    begingDate: Date;       // Date de début
    endDate: Date;          // Date de fin
    active: boolean;        // Promotion active ou non
}
