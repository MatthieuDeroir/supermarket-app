// modules/users/user.routes.ts
import { Hono } from "../../deps.ts";
// ou import { Hono } from "hono"; si tu utilises un import map
import {
    registerHandler,
    loginHandler,
    updateUserHandler,
    getUserHandler,
} from "./user.controller.ts";

const userRoutes = new Hono();

// POST /users/register
userRoutes.post("/register", registerHandler);

// POST /users/login
userRoutes.post("/login", loginHandler);

// PATCH /users
userRoutes.patch("/", updateUserHandler);

// GET /users/:id
userRoutes.get("/:id", getUserHandler);

export default userRoutes;
