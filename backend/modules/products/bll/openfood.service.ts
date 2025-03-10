// modules/products/bll/openfood.service.ts
import productRepository from "../dal/product.repository.ts";
import { Product } from "../product.model.ts";
import { ProductCreateDto } from "../dto/product.dto.ts";

class OpenFoodService {
    async insertProductFromEAN(
        ean: string,
        additionalData: Partial<ProductCreateDto> = {}
    ): Promise<Product | null> {
        // 1) Fetch product details from Open Food Facts
        const newProduct = await this.fetchProductFromEAN(ean);

        if (newProduct == null) {
            return null;
        }

        // 2) Merge additional data with fetched product details
        const mergedProduct = {
            ...newProduct,
            ...additionalData
        };

        // 3) Ensure required fields are present
        const productToInsert = this.ensureProductFields(mergedProduct, ean);

        // 4) Insert into DB and get the new ID
        const newId = await productRepository.createReturningId(productToInsert);

        // 5) Read the complete product
        const created = await productRepository.findById(newId);
        return created;
    }

    private ensureProductFields(
        product: Partial<Product>,
        ean: string
    ): Partial<Product> {
        return {
            ean: ean,
            name: product.name || "Unknown",
            brand: product.brand || "Unknown",
            description: product.description || "No description",
            picture: product.picture || "",
            nutritional_information: product.nutritional_information || "",
            price: product.price ?? 0,
            stock_warehouse: product.stock_warehouse ?? 0,
            stock_shelf_bottom: product.stock_shelf_bottom ?? 0,
            minimum_stock: product.minimum_stock ?? 0,
            minimum_shelf_stock: product.minimum_shelf_stock ?? 0,
            category_id: product.category_id ?? 1,
        };
    }

    async fetchProductFromEAN(ean: string): Promise<Partial<Product> | null> {
        // 1) Call Open Food Facts API
        const url = `https://world.openfoodfacts.org/api/v0/product/${ean}.json`;

        try {
            const res = await fetch(url);

            // Handle network or response errors
            if (!res.ok) {
                console.error(`API response not OK: ${res.status} ${res.statusText}`);
                return null;
            }

            // Try to parse JSON
            const data = await res.json();

            // Check if product exists
            if (data.status !== 1) {
                console.warn(`Product not found or invalid status: ${ean}`);
                return null;
            }

            // 2) Extract interesting information
            const offProduct = data.product;

            const productName = offProduct.product_name || "Unknown";
            const brand = Array.isArray(offProduct.brands_tags) && offProduct.brands_tags.length > 0
                ? offProduct.brands_tags[0]
                : (offProduct.brands || "Unknown");

            const description = offProduct.generic_name || offProduct.ingredients_text || "No description";
            const picture = offProduct.image_front_url || offProduct.image_url || "";

            // Serialize nutrients if we want to keep everything
            const nutritional = offProduct.nutriments ? JSON.stringify(offProduct.nutriments) : "";

            // 3) Build partial object (without `product_id` which is auto-increment)
            return {
                ean: ean,
                name: productName,
                brand,
                description,
                picture,
                nutritional_information: nutritional,
                price: 0,               // Default
                stock_warehouse: 0,
                stock_shelf_bottom: 0,
                minimum_stock: 0,
                minimum_shelf_stock: 0,
                category_id: 1,          // Example
            };
        } catch (error) {
            console.error(`Error fetching product ${ean}:`, error);
            return null;
        }
    }
}

export const openFoodService = new OpenFoodService();
export default openFoodService;