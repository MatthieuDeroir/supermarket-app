// modules/roles/role.routes.ts
import { Hono } from "hono";
import roleController from "./role.controller.ts";

const roleRouter = new Hono();
roleRouter.route("/", roleController);

export default roleRouter;
