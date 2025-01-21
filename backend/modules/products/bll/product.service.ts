// modules/products/bll/product.service.ts
import logService from "../../logs/bll/log.service.ts";
import productRepository from "../dal/product.repository.ts";
import { Product } from "../product.model.ts";

class ProductService {
    async getAllProducts(): Promise<Product[]> {
        return productRepository.findAll();
    }

    async getProductById(product_id: number): Promise<Product | null> {
        return productRepository.findById(product_id);
    }

    /**
     * Crée un nouveau produit (PK auto-incrémentée dans votre DB).
     */
    async createProduct(data: Omit<Product, "product_id">): Promise<void> {
        // Validations éventuelles
        await productRepository.create(data);
    }

    async updateProduct(product_id: number, data: Partial<Product>): Promise<void> {
        await productRepository.update(product_id, data);
    }

    async deleteProduct(product_id: number): Promise<void> {
        await productRepository.deleteById(product_id);
    }

    /**
     * Ajouter un certain `quantity` de produits au stock warehouse
     * @param product_id L'ID du produit (PK)
     * @param quantity  La quantité à ajouter (ex. 100)
     * @param user_id
     */
    async addToWarehouse(product_id: number, quantity: number, user_id: number): Promise<Product | null> {
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        // 1) Récupérer le produit
        const product = await productRepository.findById(product_id);
        if (!product) {
            throw new Error("Product not found");
        }

        // 2) Mettre à jour le stock_warehouse
        const newWarehouse = (product.stock_warehouse ?? 0) + quantity;
        await productRepository.update(product_id, { stock_warehouse: newWarehouse });

        // 3) Relire le produit mis à jour
        const updated = await productRepository.findById(product_id);

        // 4) Log l'opération
        await logService.createLog({
            date: new Date(),
            user_id,
            product_id: String(product_id),
            quantity,
            reason: "Add to warehouse",
        });

        return updated;
    }

    /**
     * Transférer une certaine `quantity` du stock warehouse vers le fond de rayon (shelf)
     * @param product_id L'ID du produit
     * @param quantity  La quantité à transférer
     * @param user_id   L'ID de l'utilisateur qui effectue l'opération
     */
    async transferToShelf(product_id: number, quantity: number, user_id: number): Promise<Product | null> {
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        // 1) Récupérer le produit
        const product = await productRepository.findById(product_id);
        if (!product) {
            throw new Error("Product not found");
        }

        const currentWarehouse = product.stock_warehouse ?? 0;
        if (currentWarehouse < quantity) {
            throw new Error("Not enough stock in warehouse");
        }

        // 2) Décrémenter warehouse, incrémenter shelf
        const newWarehouse = currentWarehouse - quantity;
        const newShelf = (product.stock_shelf_bottom ?? 0) + quantity;

        await productRepository.update(product_id, {
            stock_warehouse: newWarehouse,
            stock_shelf_bottom: newShelf,
        });

        // 3) Relire le produit mis à jour
        const updated = await productRepository.findById(product_id);

        await logService.createLog({
            date: new Date(),
            user_id,
            product_id: String(product_id),
            quantity,
            reason: "Transfer warehouse -> shelf",
        });


        return updated;
    }
}

export const productService = new ProductService();
export default productService;
