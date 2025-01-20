// modules/logs/log.routes.ts
import { Hono } from "hono";
import logController from "./log.controller.ts";

const logRouter = new Hono();
logRouter.route("/", logController);

export default logRouter;
