// modules/products/product.controller.ts
import { Context } from "../../deps.ts";
import { ProductRepository } from "./dal/product.repository.ts";
import { ProductService } from "./bll/product.service.ts";
import { ProductCreateDto } from "./dto/product-create.dto.ts";

const repo = new ProductRepository();
const service = new ProductService(repo);

export async function createProductHandler(c: Context) {
    try {
        const body = await c.req.json();
        const dto = body as ProductCreateDto;
        const product = await service.createProduct(dto);
        return c.json(product, 201);
    } catch (err) {
        if (err instanceof Error) {
            return c.text(err.message, 400);
        }
        return c.text("Unknown error", 500);
    }
}

export async function getProductHandler(c: Context) {
    const productId = c.req.param("id");
    const product = await service.getProduct(productId);
    if (!product) {
        return c.text("Product not found", 404);
    }
    return c.json(product);
}