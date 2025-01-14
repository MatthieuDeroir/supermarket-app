// modules/products/product.model.ts
export interface Product {
    productId: string;
    price: number;
    stockWarehouse: number;
    stockShelfBottom: number;
    minimumStock: number;
    minimumShelfStock: number;
    taxCategoryId: number;
}