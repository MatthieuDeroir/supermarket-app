// modules/users/user.routes.ts
import { Hono } from "../../deps.ts";
import {

} from "./stock.controller.ts";

const stockRoutes = new Hono();

// GET /stocks/
stockRoutes.get("/");

// POST /stocks/
stockRoutes.post("/");


export default stockRoutes;
