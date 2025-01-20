// modules/users/user.routes.ts
import { Hono } from "../../deps.ts";
import {

} from "./action.controller.ts";

const actionRoutes = new Hono();

// GET /actions/
actionRoutes.get("/");

// POST /actions/
actionRoutes.post("/");


export default actionRoutes;
