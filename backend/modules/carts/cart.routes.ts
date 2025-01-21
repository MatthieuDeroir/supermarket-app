// modules/carts/cart.routes.ts
import { Hono } from "hono";
import cartController from "./cart.controller.ts";

const cartRouter = new Hono();
cartRouter.route("/", cartController);

export default cartRouter;
