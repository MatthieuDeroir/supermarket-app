// modules/users/user.routes.ts
import { Hono } from "hono";
import userController from "./user.controller.ts";

const userRouter = new Hono();
userRouter.route("/", userController);

export default userRouter;
