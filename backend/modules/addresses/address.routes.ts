// modules/addresses/addresses.routes.ts
import { Hono } from "../../deps.ts";
import {
    createAddressHandler,
    getAddressHandler,
    getAddressesForUserHandler,
    updateAddressHandler,
    deleteAddressHandler,
} from "./address.controller.ts";

const addressesRoutes = new Hono();

// POST /addresses
addressesRoutes.post("/", createAddressHandler);

// GET /addresses/:id
addressesRoutes.get("/:id", getAddressHandler);

// GET /addresses/user/:userId
addressesRoutes.get("/user/:userId", getAddressesForUserHandler);

// PATCH /addresses/:id
addressesRoutes.patch("/:id", updateAddressHandler);

// DELETE /addresses/:id
addressesRoutes.delete("/:id", deleteAddressHandler);

export default addressesRoutes;
