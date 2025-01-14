// modules/logs/log.routes.ts
import { Hono } from "../../deps.ts";
import { createLogHandler, getProductLogsHandler } from "./log.controller.ts";

const logRoutes = new Hono();

logRoutes.post("/", createLogHandler);
logRoutes.get("/product/:productId", getProductLogsHandler);

export default logRoutes;