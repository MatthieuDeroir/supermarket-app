// modules/users/dal/user.repository.ts

import { getDBClient } from "../../../config/database.ts";
import { User } from "../user.model.ts";

export class UserRepository {
    /**
     * Create a new user in the DB
     */
    async createUser(user: User): Promise<User> {
        const client = await getDBClient();
        try {
            // Using RETURNING * to get the inserted record (including ID)
            const result = await client.queryObject<{
                user_id: number;
                email: string;
                password: string;
                first_name: string | null;
                last_name: string | null;
                phone_number: string | null;
                created_at: Date | null;
                updated_at: Date | null;
                deleted_at: Date | null;
                role_id: number | null;
            }>`
                INSERT INTO users
                (email, password, first_name, last_name, phone_number,
                 created_at, updated_at, deleted_at, role_id)
                VALUES
                    (
                        ${user.email},
                        ${user.password},
                        ${user.firstName},
                        ${user.lastName},
                        ${user.phoneNumber},
                        ${user.createdAt},
                        ${user.updatedAt},
                        ${user.deletedAt},
                        ${user.roleId}
                    )
                    RETURNING
          user_id, email, password, first_name, last_name, phone_number,
          created_at, updated_at, deleted_at, role_id
            `;

            const inserted = result.rows[0];
            return {
                userId: inserted.user_id,
                email: inserted.email,
                password: inserted.password,
                firstName: inserted.first_name ?? undefined,
                lastName: inserted.last_name ?? undefined,
                phoneNumber: inserted.phone_number ?? undefined,
                createdAt: inserted.created_at ?? undefined,
                updatedAt: inserted.updated_at ?? undefined,
                deletedAt: inserted.deleted_at,
                roleId: inserted.role_id ?? undefined,
            };
        } finally {
            client.release();
        }
    }

    /**
     * Fetch a user by email (for login)
     */
    async findByEmail(email: string): Promise<User | null> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                user_id: number;
                email: string;
                password: string;
                first_name: string | null;
                last_name: string | null;
                phone_number: string | null;
                created_at: Date | null;
                updated_at: Date | null;
                deleted_at: Date | null;
                role_id: number | null;
            }>`
                SELECT *
                FROM users
                WHERE email = ${email}
            `;
            if (result.rows.length === 0) return null;

            const row = result.rows[0];
            return {
                userId: row.user_id,
                email: row.email,
                password: row.password,
                firstName: row.first_name ?? undefined,
                lastName: row.last_name ?? undefined,
                phoneNumber: row.phone_number ?? undefined,
                createdAt: row.created_at ?? undefined,
                updatedAt: row.updated_at ?? undefined,
                deletedAt: row.deleted_at,
                roleId: row.role_id ?? undefined,
            };
        } finally {
            client.release();
        }
    }

    /**
     * Fetch a user by their ID
     */
    async findById(userId: number): Promise<User | null> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                user_id: number;
                email: string;
                password: string;
                first_name: string | null;
                last_name: string | null;
                phone_number: string | null;
                created_at: Date | null;
                updated_at: Date | null;
                deleted_at: Date | null;
                role_id: number | null;
            }>`
        SELECT *
        FROM users
        WHERE user_id = ${userId}
      `;
            if (result.rows.length === 0) return null;

            const row = result.rows[0];
            return {
                userId: row.user_id,
                email: row.email,
                password: row.password,
                firstName: row.first_name ?? undefined,
                lastName: row.last_name ?? undefined,
                phoneNumber: row.phone_number ?? undefined,
                createdAt: row.created_at ?? undefined,
                updatedAt: row.updated_at ?? undefined,
                deletedAt: row.deleted_at,
                roleId: row.role_id ?? undefined,
            };
        } finally {
            client.release();
        }
    }

    /**
     * Update user (soft-delete, update info, etc.)
     */
    async updateUser(user: User): Promise<User | null> {
        const client = await getDBClient();
        try {
            // Example: updating first_name, last_name, phone_number, updated_at, deleted_at
            const result = await client.queryObject<{
                user_id: number;
                email: string;
                password: string;
                first_name: string | null;
                last_name: string | null;
                phone_number: string | null;
                created_at: Date | null;
                updated_at: Date | null;
                deleted_at: Date | null;
                role_id: number | null;
            }>`
                UPDATE users
                SET first_name = ${user.firstName},
                    last_name = ${user.lastName},
                    phone_number = ${user.phoneNumber},
                    updated_at = ${user.updatedAt},
                    deleted_at = ${user.deletedAt}
                WHERE user_id = ${user.userId}
                    RETURNING *
            `;

            if (result.rows.length === 0) return null;

            const row = result.rows[0];
            return {
                userId: row.user_id,
                email: row.email,
                password: row.password,
                firstName: row.first_name ?? undefined,
                lastName: row.last_name ?? undefined,
                phoneNumber: row.phone_number ?? undefined,
                createdAt: row.created_at ?? undefined,
                updatedAt: row.updated_at ?? undefined,
                deletedAt: row.deleted_at,
                roleId: row.role_id ?? undefined,
            };
        } finally {
            client.release();
        }
    }
}
