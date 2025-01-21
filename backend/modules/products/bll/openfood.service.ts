// modules/products/bll/openfood.service.ts
import productRepository from "../dal/product.repository.ts";
import { Product } from "../product.model.ts";

class OpenFoodService {
    async fetchProductFromEAN(ean: string): Promise<Product | null> {
        // 1) Appel à l’API OFF
        const url = `https://world.openfoodfacts.org/api/v0/product/${ean}.json`;
        const res = await fetch(url);
        if (!res.ok) {
            return null;
        }
        const data = await res.json();

        if (data.status !== 1) {
            // signifie que le produit n’est pas trouvé
            return null;
        }

        // 2) Extraire les infos utiles
        const productData = data.product;

        // Par exemple, on récupère un nom, un brand, etc.
        const productName = productData.product_name || "Unknown";
        const brand = Array.isArray(productData.brands_tags) && productData.brands_tags.length > 0
            ? productData.brands_tags[0]
            : productData.brands || "Unknown";

        // 3) Créer un "Product" interne
        // => Adaptez selon votre schéma. On suppose productId est un auto-increment.
        //    On met un "price" arbitraire à 0, etc. categoryId = 1 par défaut, etc.
        //    Ajustez selon vos colonnes.
        const product: Omit<Product, "product_id"> = {
            price: 0,
            stock_warehouse: 0,
            stock_shelf_bottom: 0,
            minimum_stock: 0,
            minimum_shelf_stock: 0,
            category_id: 1, // par exemple
            // Données custom
            name: productName,       // si vous avez un champ "name" dans product.model.ts
            brand: brand,            // si vous avez un champ "brand"
            ean: ean,                // si vous tenez à stocker l’EAN en DB
        } as any;

        // 4) Enregistrer ce produit dans la DB
        const createdId = await productRepository.createReturningId(product);

        // 5) Retourner le produit complet
        // => On refait un findById pour choper le product créé, ou on assemble.
        const created = await productRepository.findById(createdId);
        return created;
    }
}

export const openFoodService = new OpenFoodService();
export default openFoodService;
