// modules/products/product.controller.ts
import { Hono } from "hono";
import { productService } from "./bll/product.service.ts";

const productController = new Hono();

// GET /product
productController.get("/", async (c) => {
    const products = await productService.getAllProducts();
    return c.json(products);
});

// GET /product/:productId
productController.get("/:productId", async (c) => {
    const productId = Number(c.req.param("productId"));  // <-- Convertir en number
    const product = await productService.getProductById(productId);
    if (!product) {
        return c.json({ message: "Product not found" }, 404);
    }
    return c.json(product);
});

// POST /product
productController.post("/", async (c) => {
    const body = await c.req.json();
    await productService.createProduct(body);
    return c.json({ message: "Product created" }, 201);
});

// PUT /product/:productId
productController.put("/:productId", async (c) => {
    const productId = Number(c.req.param("productId"));
    const body = await c.req.json();
    await productService.updateProduct(productId, body);
    return c.json({ message: "Product updated" });
});

// DELETE /product/:productId
productController.delete("/:productId", async (c) => {
    const productId = Number(c.req.param("productId"));
    await productService.deleteProduct(productId);
    return c.json({ message: "Product deleted" });
});

export default productController;
