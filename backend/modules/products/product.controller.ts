// modules/products/product.controller.ts
import { Hono } from "hono";
import productService from "./bll/product.service.ts";

// Type declaration for TypeScript to recognize userId in context
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
    try {
        const body = await c.req.json();
        // Get userId from JWT context
        const userId = c.get("userId");

        if (!userId) {
            return c.json({ message: "Authentication required" }, 401);
        }

        await productService.createProduct(body, userId);
        return c.json({ message: "Product created" }, 201);
    } catch (err) {
        console.error("Error creating product:", err);
        return c.json({
            message: err instanceof Error ? err.message : "An error occurred"
        }, 400);
    }
});

// PUT /product/:product_id
productController.put("/:product_id", async (c) => {
    try {
        const productId = Number(c.req.param("product_id"));
        const body = await c.req.json();
        // Get userId from JWT context
        const userId = c.get("userId");

        if (!userId) {
            return c.json({ message: "Authentication required" }, 401);
        }

        await productService.updateProduct(productId, body, userId);
        return c.json({ message: "Product updated" });
    } catch (err) {
        console.error("Error updating product:", err);
        return c.json({
            message: err instanceof Error ? err.message : "An error occurred"
        }, 400);
    }
});

// DELETE /product/:product_id
productController.delete("/:product_id", async (c) => {
    try {
        const productId = Number(c.req.param("product_id"));
        // Get userId from JWT context
        const userId = c.get("userId");

        if (!userId) {
            return c.json({ message: "Authentication required" }, 401);
        }

        await productService.deleteProduct(productId, userId);
        return c.json({ message: "Product deleted" });
    } catch (err) {
        console.error("Error deleting product:", err);
        return c.json({
            message: err instanceof Error ? err.message : "An error occurred"
        }, 400);
    }
});

/**
 * POST /products/:productId/add-to-warehouse
 * Body { "quantity": 50 }
 */
productController.post("/:productId/add-to-warehouse", async (c) => {
    try {
        const productId = Number(c.req.param("productId"));
        const { quantity } = await c.req.json();
        // Get userId from JWT context
        const userId = c.get("userId");

        if (!userId) {
            return c.json({ message: "Authentication required" }, 401);
        }

        const updated = await productService.addToWarehouse(productId, quantity, userId);
        return c.json(updated);
    } catch (err) {
        console.error("Error adding to warehouse:", err);
        return c.json({
            message: err instanceof Error ? err.message : String(err)
        }, 400);
    }
});

/**
 * POST /products/:productId/warehouse-to-shelf
 * Body { "quantity": 20 }
 */
productController.post("/:productId/warehouse-to-shelf", async (c) => {
    try {
        const productId = Number(c.req.param("productId"));
        const { quantity } = await c.req.json();
        // Get userId from JWT context
        const userId = c.get("userId");

        if (!userId) {
            return c.json({ message: "Authentication required" }, 401);
        }

        const updated = await productService.transferToShelf(productId, quantity, userId);
        return c.json(updated);
    } catch (err) {
        console.error("Error transferring to shelf:", err);
        return c.json({
            message: err instanceof Error ? err.message : String(err)
        }, 400);
    }
});

/**
 * POST /products/:productId/shelf-to-warehouse
 * Body { "quantity": 20 }
 */
productController.post("/:productId/shelf-to-warehouse", async (c) => {
    try {
        const productId = Number(c.req.param("productId"));
        const { quantity } = await c.req.json();
        // Get userId from JWT context
        const userId = c.get("userId");

        if (!userId) {
            return c.json({ message: "Authentication required" }, 401);
        }

        const updated = await productService.transferToWarehouse(productId, quantity, userId);
        return c.json(updated);
    } catch (err) {
        console.error("Error transferring to warehouse:", err);
        return c.json({
            message: err instanceof Error ? err.message : String(err)
        }, 400);
    }
});

/**
 * POST /products/:productId/warehouse-to-trash
 * Body { "quantity": 20 }
 */
productController.post("/:productId/warehouse-to-trash", async (c) => {
    try {
        const productId = Number(c.req.param("productId"));
        const { quantity } = await c.req.json();
        // Get userId from JWT context
        const userId = c.get("userId");

        if (!userId) {
            return c.json({ message: "Authentication required" }, 401);
        }

        // Fix: Using the correct method transferWarehouseToTrash instead of transferToShelf
        const updated = await productService.transferWarehouseToTrash(productId, quantity, userId);
        return c.json(updated);
    } catch (err) {
        console.error("Error transferring from warehouse to trash:", err);
        return c.json({
            message: err instanceof Error ? err.message : String(err)
        }, 400);
    }
});

/**
 * POST /products/:productId/shelf-to-trash
 * Body { "quantity": 20 }
 */
productController.post("/:productId/shelf-to-trash", async (c) => {
    try {
        const productId = Number(c.req.param("productId"));
        const { quantity } = await c.req.json();
        // Get userId from JWT context
        const userId = c.get("userId");

        if (!userId) {
            return c.json({ message: "Authentication required" }, 401);
        }

        // Fix: Using the correct method transferShelfToTrash instead of transferToShelf
        const updated = await productService.transferShelfToTrash(productId, quantity, userId);
        return c.json(updated);
    } catch (err) {
        console.error("Error transferring from shelf to trash:", err);
        return c.json({
            message: err instanceof Error ? err.message : String(err)
        }, 400);
    }
});

export default productController;