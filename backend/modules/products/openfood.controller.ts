// modules/products/openfood.controller.ts
import { Hono } from "hono";
import { openFoodService } from "./bll/openfood.service.ts";

const openFoodController = new Hono();

// GET /products/openfood?ean=3029330003533
openFoodController.get("/", async (c) => {
    const ean = c.req.query("ean");
    if (!ean) {
        return c.json({ message: "Missing EAN parameter" }, 400);
    }
    try {
        const product = await openFoodService.fetchProductFromEAN(ean);
        if (!product) {
            return c.json({ message: "Product not found in Open Food Facts" }, 404);
        }
        return c.json(product);
    } catch (err) {
        console.error(err);
        return c.json({ message: "Error fetching product" }, 500);
    }
});

export default openFoodController;
