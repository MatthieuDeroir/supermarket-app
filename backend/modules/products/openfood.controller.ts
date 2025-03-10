// modules/products/openfood.controller.ts
import { Hono } from "hono";
import { openFoodService } from "./bll/openfood.service.ts";
import { ProductCreateDto } from "./dto/product.dto.ts";

const openFoodController = new Hono();

// GET /products/openfood?ean=3029330003533
openFoodController.get("/", async (c) => {
    const ean = c.req.query("ean");
    if (!ean) {
        return c.json({ error: "Missing EAN parameter" }, 400);
    }
    try {
        const product = await openFoodService.fetchProductFromEAN(ean);
        return c.json(product); // If the product exists, return it
    } catch (err) {
        console.error(err);

        // Handle known errors explicitly
        if (err instanceof Error) {
            return c.json({ error: err.message }, 400);
        }

        // Default error handling for unknown issues
        return c.json({ error: "An unexpected error occurred." }, 500);
    }
});

// POST /products/openfood?ean=3029330003533
openFoodController.post("/", async (c) => {
    const ean = c.req.query("ean");

    // Check if EAN is provided
    if (!ean) {
        return c.json({ message: "Missing EAN parameter" }, 400);
    }

    try {
        // Try to parse the request body, but make it optional
        let body: Partial<ProductCreateDto> = {};
        try {
            body = await c.req.json();
        } catch (parseErr) {
            console.warn("No body provided or invalid JSON:", parseErr);
        }

        // Insert product from EAN
        const product = await openFoodService.insertProductFromEAN(ean, body);

        if (!product) {
            return c.json({ message: "Product not found in Open Food Facts" }, 404);
        }

        return c.json(product);
    } catch (err) {
        console.error(err);
        return c.json({
            message: "Error fetching or inserting product",
            error: err instanceof Error ? err.message : String(err)
        }, 500);
    }
});

export default openFoodController;