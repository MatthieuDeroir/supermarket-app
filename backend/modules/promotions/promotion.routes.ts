// modules/promotions/promotion.routes.ts
import { Hono } from "hono";
import promotionController from "./promotion.controller.ts";

const promotionRouter = new Hono();
promotionRouter.route("/", promotionController);

export default promotionRouter;
