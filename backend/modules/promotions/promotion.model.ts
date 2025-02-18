// modules/promotions/promotion.model.ts
export interface Promotion {
  [key: string]: unknown; // <= index signature
  promotion_id: number;
  product_id: string;
  pourcentage: number;
  beging_date: Date;
  end_date: Date;
  active: boolean;
}
