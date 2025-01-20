// modules/products/product.model.ts
export interface Product {
    [key: string]: unknown;
    productId: number;         // <-- Désormais de type number
    price: number;
    stockWarehouse: number;
    stockShelfBottom: number;
    minimumStock: number;
    minimumShelfStock: number;
    categoryId: number;        // FK vers category
}
