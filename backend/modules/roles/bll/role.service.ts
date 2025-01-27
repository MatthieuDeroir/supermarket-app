// modules/roles/bll/role.service.ts
import roleRepository from "../dal/role.repository.ts";
import { Role } from "../role.model.ts";

class RoleService {
    async getAllRoles(): Promise<Role[]> {
        return roleRepository.findAll();
    }

    async getRoleById(roleId: number): Promise<Role | null> {
        return roleRepository.findById(roleId);
    }

    async createRole(data: Omit<Role, "roleId">): Promise<void> {
        await roleRepository.create(data);
    }

    async updateRole(roleId: number, data: Partial<Role>): Promise<void> {
        await roleRepository.update(roleId, data);
    }

    async deleteRole(roleId: number): Promise<void> {
        await roleRepository.deleteById(roleId);
    }
}

export const roleService = new RoleService();
export default roleService;
