// modules/products/bll/openfood.service.ts
import productRepository from "../dal/product.repository.ts";
import { Product } from "../product.model.ts";

class OpenFoodService {
    async fetchProductFromEAN(ean: string): Promise<Product | null> {
        // 1) Check if the product already exists in the database
        const existingProduct = await productRepository.findByEAN(ean);
        if (existingProduct) {
            throw new Error(`Product with EAN ${ean} already exists in the database`);
        }

        // 2) Call the Open Food Facts API
        const url = `https://world.openfoodfacts.org/api/v0/product/${ean}.json`;
        const res = await fetch(url);
        if (!res.ok) return null;

        const data = await res.json();
        if (data.status !== 1) {
            // Product not found on Open Food Facts
            return null;
        }

        // 3) Extract relevant information from the API response
        const offProduct = data.product;

        const productName = offProduct.product_name || "Unknown";
        const brand = Array.isArray(offProduct.brands_tags) && offProduct.brands_tags.length > 0
            ? offProduct.brands_tags[0]
            : (offProduct.brands || "Unknown");

        const description = offProduct.generic_name || offProduct.ingredients_text || "No description";
        const picture = offProduct.image_front_url || offProduct.image_url || "";
        const nutritional = offProduct.nutriments ? JSON.stringify(offProduct.nutriments) : "";

        // 4) Construct the new product object
        const newProduct: Partial<Product> = {
            ean: ean,
            name: productName,
            brand,
            description,
            picture,
            nutritional_information: nutritional,
            price: 0,               // Default price
            stock_warehouse: 0,
            stock_shelf_bottom: 0,
            minimum_stock: 0,
            minimum_shelf_stock: 0,
            category_id: 1,         // Example category ID
        };

        // 5) Insert the new product into the database and retrieve its ID
        const newId = await productRepository.createReturningId(newProduct);

        // 6) Retrieve the complete product record
        const created = await productRepository.findById(newId);
        return created;
    }
}

export const openFoodService = new OpenFoodService();
export default openFoodService;