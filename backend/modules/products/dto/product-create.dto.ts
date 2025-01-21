// modules/products/dto/product-create.dto.ts
export interface ProductCreateDto {
    productId: number;         // <-- Désormais de type number
    ean: string;
    name: string;
    brand: string;
    description: string;
    picture: string;
    nutritional_information: string;
    price: number;
    stockWarehouse: number;
    stockShelfBottom: number;
    minimumStock: number;
    minimumShelfStock: number;
    categoryId: number;        // FK vers category
}
