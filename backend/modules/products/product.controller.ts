// modules/products/product.controller.ts
import { Hono } from "hono";
import { productService } from "./bll/product.service.ts";


// Au tout début de votre fichier product.controller.ts (ou dans un fichier d'inclusion global)
declare module "hono" {
    interface ContextVariableMap {
        userId: number;
    }
}

const productController = new Hono();

// GET /product
productController.get("/", async (c) => {
    const products = await productService.getAllProducts();
    return c.json(products);
});

// GET /product/:product_id
productController.get("/:product_id", async (c) => {
    const productId = Number(c.req.param("product_id"));
    const product = await productService.getProductById(productId);
    if (!product) {
        return c.json({ message: "Product not found" }, 404);
    }
    return c.json(product);
});

// POST /product
productController.post("/", async (c) => {
    const body = await c.req.json();
    await productService.createProduct(body, 1); // TODO: récupérer userId depuis le JWT
    return c.json({ message: "Product created" }, 201);
});

// PUT /product/:product_id
productController.put("/:product_id", async (c) => {
    const productId = Number(c.req.param("product_id"));
    const body = await c.req.json();
    await productService.updateProduct(productId, body);
    return c.json({ message: "Product updated" });
});

// DELETE /product/:product_id
productController.delete("/:product_id", async (c) => {
    const productId = Number(c.req.param("product_id"));
    await productService.deleteProduct(productId);
    return c.json({ message: "Product deleted" });
});

/**
 * POST /products/:productId/warehouse
 * Body { "quantity": 50 }
 */
productController.post("/:productId/add-to-warehouse", async (c) => {
    const productId = Number(c.req.param("productId"));
    const { quantity } = await c.req.json();

    const user_id: number = c.get("userId") as unknown as number;


    try {
        const updated = await productService.addToWarehouse(productId, quantity, user_id);
        return c.json(updated);
    } catch (err) {
        // Retourne uniquement le message d'erreur sous forme de chaîne
        return c.json({ message: err instanceof Error ? err.message : String(err) }, 400);
    }
});


/**
 * POST /products/:productId/shelf
 * Body { "quantity": 20 }
 */
productController.post("/:productId/warehouse-to-shelf", async (c) => {
    const productId = Number(c.req.param("productId"));
    const { quantity } = await c.req.json();

    const user_id: number = c.get("userId") as unknown as number;


    try {
        const updated = await productService.transferToShelf(productId, quantity, user_id);
        return c.json(updated);
    } catch (err) {
        return c.json({ message: err }, 400);
    }
});

productController.post("/:productId/shelf-to-warehouse", async (c) => {
    const productId = Number(c.req.param("productId"));
    const { quantity } = await c.req.json();

    const user_id: number = c.get("userId") as unknown as number;



    try {
        const updated = await productService.transferToWarehouse(productId, quantity, user_id);
        return c.json(updated);
    } catch (err) {
        return c.json({ message: err }, 400);
    }
});

productController.post("/:productId/warehouse-to-trash", async (c) => {
    const productId = Number(c.req.param("productId"));
    const { quantity } = await c.req.json();

    const user_id: number = c.get("userId") as unknown as number;



    try {
        const updated = await productService.transferToShelf(productId, quantity, user_id);
        return c.json(updated);
    } catch (err) {
        return c.json({ message: err }, 400);
    }
});

productController.post("/:productId/shelf-to-trash", async (c) => {
    const productId = Number(c.req.param("productId"));
    const { quantity } = await c.req.json();

    const user_id: number = c.get("userId") as unknown as number;



    try {
        const updated = await productService.transferToShelf(productId, quantity, user_id);
        return c.json(updated);
    } catch (err) {
        return c.json({ message: err }, 400);
    }
});

export default productController;
