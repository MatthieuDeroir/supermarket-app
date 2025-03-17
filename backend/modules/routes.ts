// modules/routes.ts
import { Hono } from 'hono';

// Import routers
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
import paymentRouter from "./payment/payment.routes.ts";
import shopRouter from "./shop/shop.routes.ts";
import favoriteRouter from "./favorites/favorite.routes.ts"; // New favorite router

// Import auth controller
import authController from "./auth/auth.controller.ts";

// Import auth middleware
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const routes = new Hono();

/**
 * 1) Mount auth routes first
 *    => They won't have the auth middleware
 */
routes.route("/auth", authController);

/**
 * 2) Apply auth middleware to all subsequent routes (*).
 *    => Everything that didn't match /auth will go through the middleware.
 */
routes.use("*", authMiddleware);

/**
 * 3) Mount all other routes
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
routes.route("/payment", paymentRouter);
routes.route("/shop", shopRouter);
routes.route("/favorites", favoriteRouter); // New favorites endpoint

export default routes;