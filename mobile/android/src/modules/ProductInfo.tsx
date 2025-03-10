// src/modules/ProductInfo.ts

interface ProductInfo {
    product_id: string;
    ean: string;
    name: string;
    brand: string;
    description: string;
    picture: string;
    categories: string[];
    nutritional_information: Record<string, string | number>;
    price: number;
}

let product: ProductInfo | null = null;

export const setProductInfo = (
    product_id: string,
    ean: string,
    name: string,
    brand: string,
    description: string,
    picture: string,
    categories: string[],
    nutritional_information: Record<string, string | number>,
    price: number
) => {
    product = {
        product_id,
        ean,
        name,
        brand,
        description,
        picture,
        categories,
        nutritional_information,
        price
    };
};


export const getProductInfo = (): ProductInfo | null => {
    return product;
};
