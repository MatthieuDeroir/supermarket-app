// modules/products/bll/product.service.ts
import { ProductRepository } from "../dal/product.repository.ts";
import { Product } from "../product.model.ts";
import { ProductCreateDto } from "../dto/product-create.dto.ts";

export class ProductService {
    constructor(private productRepo: ProductRepository) {}

    async createProduct(dto: ProductCreateDto): Promise<Product> {
        const existing = await this.productRepo.findById(dto.productId);
        if (existing) {
            throw new Error("Product ID already exists");
        }
        return await this.productRepo.createProduct(dto);
    }

    async getProduct(productId: string): Promise<Product | null> {
        return await this.productRepo.findById(productId);
    }
}