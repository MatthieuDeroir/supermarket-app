// modules/products/bll/product.service.ts
import { Product } from "../product.model.ts";
import productRepository from "../dal/product.repository.ts";

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
    async createProduct(data: Omit<Product, "productId">): Promise<void> {
        // Validations éventuelles
        await productRepository.create(data);
    }

    async updateProduct(productId: number, data: Partial<Product>): Promise<void> {
        await productRepository.update(productId, data);
    }

    async deleteProduct(productId: number): Promise<void> {
        await productRepository.deleteById(productId);
    }
}

export const productService = new ProductService();
export default productService;
