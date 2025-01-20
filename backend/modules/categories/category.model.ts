// modules/tax/tax.model.ts
export interface Category {
    [key: string]: unknown; // <= index signature
    taxCategoryId: number;
    value: number;
    description: string;
}