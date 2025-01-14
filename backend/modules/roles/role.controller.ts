import type { Context } from "../../deps.ts";
import { RolesRepository } from "./dal/role.repository.ts";
import { RolesService } from "./bll/role.service.ts";
import { RoleCreateDto } from "./dto/role-create.dto.ts";

const repo = new RolesRepository();
const service = new RolesService(repo);

export async function createRoleHandler(c: Context) {
    const body = await c.req.json();
    const dto = body as RoleCreateDto;
    const role = await service.createRole(dto);
    return c.json(role, 201);
}

export async function getRoleHandler(c: Context) {
    const roleId = parseInt(c.req.param("id"), 10);
    const role = await service.getRoleById(roleId);
    if (!role) return c.text("Role not found", 404);
    return c.json(role);
}

export async function getAllRolesHandler(c: Context) {
    const roles = await service.getAllRoles();
    return c.json(roles);
}

export async function updateRoleHandler(c: Context) {
    const roleId = parseInt(c.req.param("id"), 10);
    const body = await c.req.json();
    const dto = body as RoleCreateDto;
    const updated = await service.updateRole(roleId, dto);
    if (!updated) return c.text("Role not found", 404);
    return c.json(updated);
}

export async function deleteRoleHandler(c: Context) {
    const roleId = parseInt(c.req.param("id"), 10);
    const success = await service.deleteRole(roleId);
    if (!success) return c.text("Role not found", 404);
    return c.text("Role deleted", 200);
}
