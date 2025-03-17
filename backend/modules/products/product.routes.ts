// modules/products/product.routes.ts
import { Hono } from "hono";
import productController from "./product.controller.ts";

const productRouter = new Hono();
productRouter.route("/", productController);

export default productRouter;
