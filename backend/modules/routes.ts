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
import paymentRouter from "./payment/payment.routes.ts";

const routes = new Hono();

// Monte chaque module sur son URL
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

export default routes;
