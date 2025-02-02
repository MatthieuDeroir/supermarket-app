// modules/products/bll/openfood.service.ts
import productRepository from "../dal/product.repository.ts";
import { Product } from "../product.model.ts";

class OpenFoodService {
    async fetchProductFromEAN(ean: string): Promise<Product | null> {
        // 1) Appel à l’API OFF
        const url = `https://world.openfoodfacts.org/api/v0/product/${ean}.json`;
        const res = await fetch(url);
        if (!res.ok) return null;

        const data = await res.json();
        if (data.status !== 1) {
            // produit non trouvé
            return null;
        }

        // 2) Extraire les infos intéressantes
        const offProduct = data.product;

        const productName = offProduct.product_name || "Unknown";
        const brand = Array.isArray(offProduct.brands_tags) && offProduct.brands_tags.length > 0
            ? offProduct.brands_tags[0]
            : (offProduct.brands || "Unknown");

        const description = offProduct.generic_name || offProduct.ingredients_text || "No description";
        const picture = offProduct.image_front_url || offProduct.image_url || "";
        // On sérialise les nutriments si on veut tout garder
        const nutritional = offProduct.nutriments ? JSON.stringify(offProduct.nutriments) : "";

        // 3) Construire l'objet partiel (sans `product_id` qui est auto-incrément)
        const newProduct: Partial<Product> = {
            ean: ean,
            name: productName,
            brand,
            description,
            picture,
            nutritional_information: nutritional,
            price: 0,               // Par défaut
            stock_warehouse: 0,
            stock_shelf_bottom: 0,
            minimum_stock: 0,
            minimum_shelf_stock: 0,
            category_id: 1,         // Par exemple
        };

        // 4) Insérer en DB et récupérer product_id
        const newId = await productRepository.createReturningId(newProduct);

        // 5) Relire le produit complet
        const created = await productRepository.findById(newId);
        return created;
    }
}

export const openFoodService = new OpenFoodService();
export default openFoodService;