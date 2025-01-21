// modules/categories/category.routes.ts
import { Hono } from "hono";
import categoryController from "./category.controller.ts";

const categoryRouter = new Hono();
categoryRouter.route("/", categoryController);

export default categoryRouter;
