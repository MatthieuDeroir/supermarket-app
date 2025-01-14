import { RolesRepository } from "../dal/role.repository.ts";
import { RoleCreateDto } from "../dto/role-create.dto.ts";
import { RoleResponseDto } from "../dto/role-response.dto.ts";
import { Role } from "../role.model.ts";

export class RolesService {
    constructor(private rolesRepo: RolesRepository) {}

    async createRole(dto: RoleCreateDto): Promise<RoleResponseDto> {
        const role: Role = {
            roleId: 0,
            name: dto.name,
        };

        const created = await this.rolesRepo.createRole(role);
        return {
            roleId: created.roleId,
            name: created.name,
        };
    }

    async getRoleById(roleId: number): Promise<RoleResponseDto | null> {
        const role = await this.rolesRepo.findRoleById(roleId);
        if (!role) return null;
        return {
            roleId: role.roleId,
            name: role.name,
        };
    }

    async getAllRoles(): Promise<RoleResponseDto[]> {
        const roles = await this.rolesRepo.findAllRoles();
        return roles.map((role) => ({
            roleId: role.roleId,
            name: role.name,
        }));
    }

    async updateRole(roleId: number, dto: RoleCreateDto): Promise<RoleResponseDto | null> {
        const role: Role = {
            roleId,
            name: dto.name,
        };

        const updated = await this.rolesRepo.updateRole(role);
        if (!updated) return null;
        return {
            roleId: updated.roleId,
            name: updated.name,
        };
    }

    async deleteRole(roleId: number): Promise<boolean> {
        return await this.rolesRepo.deleteRole(roleId);
    }
}
