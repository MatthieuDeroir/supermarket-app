// modules/shop/shop.routes.ts
import { Hono } from "hono";
import shopController from "./shop.controller.ts";

const shopRouter = new Hono();
shopRouter.route("/", shopController);

export default shopRouter;