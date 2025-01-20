// modules/promotions/promotion.model.ts
export interface Promotion {
    [key: string]: unknown; // <= index signature
    promotionId: number;
    productId: string;
    pourcentage: number;
    begingDate: Date;
    endDate: Date;
    active: boolean;
}
