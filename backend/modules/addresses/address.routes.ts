import { Hono } from "hono";
import addressController from "./address.controller.ts";

/**
 * On déclare un "router" Hono qui monte le contrôleur
 * sur la racine "/"
 */
const addressRouter = new Hono();

// Tous les endpoints définis dans addressController sont montés sur "/"
addressRouter.route("/", addressController);

export default addressRouter;
