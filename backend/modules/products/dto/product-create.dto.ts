// modules/products/dto/product-create.dto.ts
export interface ProductCreateDto {
    productId: string;
    price: number;
    stockWarehouse: number;
    stockShelfBottom: number;
    minimumStock: number;
    minimumShelfStock: number;
    taxCategoryId: number;
}