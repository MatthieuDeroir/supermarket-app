// modules/products/product.routes.ts
import { Hono } from "../../deps.ts";
import { createProductHandler, getProductHandler } from "./product.controller.ts";

const productRoutes = new Hono();

productRoutes.post("/", createProductHandler);
productRoutes.get("/:id", getProductHandler);

export default productRoutes;