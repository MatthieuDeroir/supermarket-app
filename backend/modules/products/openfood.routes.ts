// modules/products/openfood.routes.ts
import { Hono } from "hono";
import openfoodController from "./openfood.controller.ts";

const openfoodRouter = new Hono();
openfoodRouter.route("/", openfoodController);

export default openfoodRouter;
