// modules/roles/role.controller.ts
import { Hono } from "hono";
import { roleService } from "./bll/role.service.ts";

const roleController = new Hono();

// GET /role
roleController.get("/", async (c) => {
    const roles = await roleService.getAllRoles();
    return c.json(roles);
});

// GET /role/:roleId
roleController.get("/:roleId", async (c) => {
    const roleId = Number(c.req.param("roleId"));
    const role = await roleService.getRoleById(roleId);
    if (!role) {
        return c.json({ message: "Role not found" }, 404);
    }
    return c.json(role);
});

// POST /role
roleController.post("/", async (c) => {
    const body = await c.req.json();
    await roleService.createRole(body);
    return c.json({ message: "Role created" }, 201);
});

// PUT /role/:roleId
roleController.put("/:roleId", async (c) => {
    const roleId = Number(c.req.param("roleId"));
    const body = await c.req.json();
    await roleService.updateRole(roleId, body);
    return c.json({ message: "Role updated" });
});

// DELETE /role/:roleId
roleController.delete("/:roleId", async (c) => {
    const roleId = Number(c.req.param("roleId"));
    await roleService.deleteRole(roleId);
    return c.json({ message: "Role deleted" });
});

export default roleController;
