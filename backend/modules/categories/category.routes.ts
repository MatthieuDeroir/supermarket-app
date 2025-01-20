// modules/tax/tax-category.routes.ts
import { Hono } from "../../deps.ts";
import { createTaxCategoryHandler, getAllTaxCategoriesHandler } from "./tax.controller.ts";

const taxCategoryRoutes = new Hono();

taxCategoryRoutes.post("/", createTaxCategoryHandler);
taxCategoryRoutes.get("/", getAllTaxCategoriesHandler);

export default taxCategoryRoutes;