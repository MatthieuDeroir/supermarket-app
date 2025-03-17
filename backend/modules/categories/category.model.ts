// modules/tax/tax.model.ts
export interface Category {
    [key: string]: unknown; // <= index signature
    categoryId: number;
    value: number;
    description: string;
}