// modules/products/bll/product.service.ts
import productRepository from "../dal/product.repository.ts";
import { Product } from "../product.model.ts";

class ProductService {
    async getAllProducts(): Promise<Product[]> {
        return productRepository.findAll();
    }

    async getProductById(productId: number): Promise<Product | null> {
        return productRepository.findById(productId);
    }

    /**
     * Crée un nouveau produit (PK auto-incrémentée dans votre DB).
     */
    async createProduct(data: Omit<Product, "product_id">): Promise<void> {
        // Validations éventuelles
        await productRepository.create(data);
    }

    async updateProduct(productId: number, data: Partial<Product>): Promise<void> {
        await productRepository.update(productId, data);
    }

    async deleteProduct(productId: number): Promise<void> {
        await productRepository.deleteById(productId);
    }

    /**
     * Ajouter un certain `quantity` de produits au stock warehouse
     * @param productId L'ID du produit (PK)
     * @param quantity  La quantité à ajouter (ex. 100)
     */
    async addToWarehouse(productId: number, quantity: number): Promise<Product | null> {
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        // 1) Récupérer le produit
        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        // 2) Mettre à jour le stock_warehouse
        const newWarehouse = (product.stock_warehouse ?? 0) + quantity;
        await productRepository.update(productId, { stock_warehouse: newWarehouse });

        // 3) Relire le produit mis à jour
        const updated = await productRepository.findById(productId);
        return updated;
    }

    /**
     * Transférer une certaine `quantity` du stock warehouse vers le fond de rayon (shelf)
     * @param productId L'ID du produit
     * @param quantity  La quantité à transférer
     */
    async transferToShelf(productId: number, quantity: number): Promise<Product | null> {
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        // 1) Récupérer le produit
        const product = await productRepository.findById(productId);
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

        await productRepository.update(productId, {
            stock_warehouse: newWarehouse,
            stock_shelf_bottom: newShelf,
        });

        // 3) Relire le produit mis à jour
        const updated = await productRepository.findById(productId);
        return updated;
    }
}

export const productService = new ProductService();
export default productService;
