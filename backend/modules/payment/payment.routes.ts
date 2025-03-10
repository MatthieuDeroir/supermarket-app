// modules/logs/log.routes.ts
import { Hono } from "hono";
import paymentController from "./payment.controller.ts";

const paymentRouter = new Hono();
paymentRouter.route("/", paymentController);

export default paymentRouter;
