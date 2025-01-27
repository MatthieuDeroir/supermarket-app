// modules/products/product.model.ts
/**
 * Correspond exactement aux colonnes de la table `products` :
 * - product_id (PK, auto-incrémentée)
 * - ean, name, brand, description, picture, nutritional_information,
 * - price, stock_warehouse, stock_shelf_bottom, minimum_stock, minimum_shelf_stock,
 * - category_id (FK)
 */
export interface Product {
    [key: string]: unknown;
    product_id: number;
    ean: string;
    name: string;
    brand: string;
    description: string;
    picture: string;
    nutritional_information: string; // on stockera du texte, par ex. du JSON
    price: number;
    stock_warehouse: number;
    stock_shelf_bottom: number;
    minimum_stock: number;
    minimum_shelf_stock: number;
    category_id: number;
}
