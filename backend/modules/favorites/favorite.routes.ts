// modules/favorites/favorite.routes.ts
import { Hono } from "hono";
import favoriteController from "./favorite.controller.ts";

const favoriteRouter = new Hono();
favoriteRouter.route("/", favoriteController);

export default favoriteRouter;