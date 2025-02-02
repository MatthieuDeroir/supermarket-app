// modules/routes.ts
import { Hono } from "hono";

// Import des routeurs
import addressesRouter from "./addresses/address.routes.ts";
import cartRouter from "./carts/cart.routes.ts";
import invoiceRouter from "./invoices/invoice.routes.ts";
import categoryRouter from "./categories/category.routes.ts";
import productRouter from "./products/product.routes.ts";
import openfoodRouter from "./products/openfood.routes.ts";
import logRouter from "./logs/log.routes.ts";
import promotionRouter from "./promotions/promotion.routes.ts";
import roleRouter from "./roles/role.routes.ts";
import userRouter from "./users/user.routes.ts";

// Import du controlleur d'auth
// import authController from "./auth/auth.controller.ts";/**/

// Import du middleware d'auth
// import { authMiddleware } from "../middlewares/auth.middleware.ts";

const routes = new Hono();

/**
 * 1) On monte d’abord la route d’auth.
 *    => Elle n’aura pas le middleware d’auth
 */
// routes.route("/auth", authController);

/**
 * 2) On applique notre middleware sur toutes les routes suivantes (*).
 *    => Tout ce qui n’a pas déjà matché /auth passera par le middleware.
 */
// routes.use("*", authMiddleware);/**/

/**
 * 3) On monte toutes les autres routes
 */
routes.route("/addresses", addressesRouter);
routes.route("/carts", cartRouter);
routes.route("/invoices", invoiceRouter);
routes.route("/categories", categoryRouter);
routes.route("/products", productRouter);
routes.route("/openfood", openfoodRouter);
routes.route("/logs", logRouter);
routes.route("/promotions", promotionRouter);
routes.route("/roles", roleRouter);
routes.route("/users", userRouter);

export default routes;
