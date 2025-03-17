// modules/roles/dal/role.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { Role } from "../role.model.ts";

export class RoleRepository extends GenericRepository<Role> {
    constructor() {
        super({
            tableName: "roles",
            primaryKey: "role_id",
        });
    }
}

const roleRepository = new RoleRepository();
export default roleRepository;
