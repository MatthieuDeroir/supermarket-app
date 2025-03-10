// Fixed promotion.model.ts
export interface Promotion {
  [key: string]: unknown; // <= index signature
  promotion_id: number;
  product_id: number; // Changed from string to number to match product_id in products table
  percentage: number; // Renamed from pourcentage for English consistency
  begin_date: Date;
  end_date: Date;
  active: boolean;
}