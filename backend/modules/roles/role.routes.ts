import { Hono } from "../../deps.ts";
import {
    createRoleHandler,
    getRoleHandler,
    getAllRolesHandler,
    updateRoleHandler,
    deleteRoleHandler,
} from "./role.controller.ts";

const rolesRoutes = new Hono();

rolesRoutes.post("/", createRoleHandler);
rolesRoutes.get("/:id", getRoleHandler);
rolesRoutes.get("/", getAllRolesHandler);
rolesRoutes.patch("/:id", updateRoleHandler);
rolesRoutes.delete("/:id", deleteRoleHandler);

export default rolesRoutes;
