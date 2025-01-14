import { getDBClient } from "../../../config/database.ts";
import { Role } from "../role.model.ts";

export class RolesRepository {
    async createRole(role: Role): Promise<Role> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{ role_id: number; name: string }>(
                `INSERT INTO roles (name)
         VALUES (${role.name})
         RETURNING role_id, name`
            );
            const inserted = result.rows[0];
            return {
                roleId: inserted.role_id,
                name: inserted.name,
            };
        } finally {
            client.release();
        }
    }

    async findRoleById(roleId: number): Promise<Role | null> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{ role_id: number; name: string }>(
                `SELECT * FROM roles WHERE role_id = ${roleId}`
            );
            if (result.rows.length === 0) return null;
            const row = result.rows[0];
            return {
                roleId: row.role_id,
                name: row.name,
            };
        } finally {
            client.release();
        }
    }

    async findAllRoles(): Promise<Role[]> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{ role_id: number; name: string }>(
                `SELECT * FROM roles`
            );
            return result.rows.map((row) => ({
                roleId: row.role_id,
                name: row.name,
            }));
        } finally {
            client.release();
        }
    }

    async updateRole(role: Role): Promise<Role | null> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{ role_id: number; name: string }>(
                `UPDATE roles
         SET name = ${role.name}
         WHERE role_id = ${role.roleId}
         RETURNING role_id, name`
            );
            if (result.rows.length === 0) return null;
            const updated = result.rows[0];
            return {
                roleId: updated.role_id,
                name: updated.name,
            };
        } finally {
            client.release();
        }
    }

    async deleteRole(roleId: number): Promise<boolean> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject(
                `DELETE FROM roles WHERE role_id = $1 RETURNING role_id`,
                [roleId]
            );

            return result.rows.length > 0;
        } finally {
            client.release();
        }
    }

}
