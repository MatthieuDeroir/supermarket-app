// modules/addresses/dal/addresses.repository.ts

import { getDBClient } from "../../../config/database.ts";
import { Address } from "../address.model.ts";

export class AddressesRepository {
    /**
     * Create a new address
     */
    async createAddress(address: Address): Promise<Address> {
        const client = await getDBClient();
        try {
            // Note: Some fields can be optional, check for undefined
            const result = await client.queryObject<{
                address_id: number;
                user_id: number | null;
                address_line1: string | null;
                address_line2: string | null;
                address_complement: string | null;
                zip_code: string | null;
                city: string | null;
                country: string | null;
            }>`
        INSERT INTO addresses
          (user_id, address_line1, address_line2, address_complement,
           zip_code, city, country)
        VALUES
          (
            ${address.userId},
            ${address.addressLine1},
            ${address.addressLine2},
            ${address.addressComplement},
            ${address.zipCode},
            ${address.city},
            ${address.country}
          )
        RETURNING
          address_id,
          user_id,
          address_line1,
          address_line2,
          address_complement,
          zip_code,
          city,
          country
      `;

            const row = result.rows[0];
            return {
                addressId: row.address_id,
                userId: row.user_id ?? undefined,
                addressLine1: row.address_line1 ?? undefined,
                addressLine2: row.address_line2 ?? undefined,
                addressComplement: row.address_complement ?? undefined,
                zipCode: row.zip_code ?? undefined,
                city: row.city ?? undefined,
                country: row.country ?? undefined,
            };
        } finally {
            client.release();
        }
    }

    /**
     * Find address by its primary key (address_id)
     */
    async findById(addressId: number): Promise<Address | null> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                address_id: number;
                user_id: number | null;
                address_line1: string | null;
                address_line2: string | null;
                address_complement: string | null;
                zip_code: string | null;
                city: string | null;
                country: string | null;
            }>`
        SELECT *
        FROM addresses
        WHERE address_id = ${addressId}
      `;
            if (result.rows.length === 0) return null;

            const row = result.rows[0];
            return {
                addressId: row.address_id,
                userId: row.user_id ?? undefined,
                addressLine1: row.address_line1 ?? undefined,
                addressLine2: row.address_line2 ?? undefined,
                addressComplement: row.address_complement ?? undefined,
                zipCode: row.zip_code ?? undefined,
                city: row.city ?? undefined,
                country: row.country ?? undefined,
            };
        } finally {
            client.release();
        }
    }

    /**
     * (Example) find addresses by a user_id
     * if you store user addresses in the same table
     */
    async findByUserId(userId: number): Promise<Address[]> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                address_id: number;
                user_id: number | null;
                address_line1: string | null;
                address_line2: string | null;
                address_complement: string | null;
                zip_code: string | null;
                city: string | null;
                country: string | null;
            }>`
        SELECT *
        FROM addresses
        WHERE user_id = ${userId}
      `;
            return result.rows.map((row) => ({
                addressId: row.address_id,
                userId: row.user_id ?? undefined,
                addressLine1: row.address_line1 ?? undefined,
                addressLine2: row.address_line2 ?? undefined,
                addressComplement: row.address_complement ?? undefined,
                zipCode: row.zip_code ?? undefined,
                city: row.city ?? undefined,
                country: row.country ?? undefined,
            }));
        } finally {
            client.release();
        }
    }

    /**
     * Update (hard-coded fields for simplicity)
     */
    async updateAddress(address: Address): Promise<Address | null> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                address_id: number;
                user_id: number | null;
                address_line1: string | null;
                address_line2: string | null;
                address_complement: string | null;
                zip_code: string | null;
                city: string | null;
                country: string | null;
            }>`
        UPDATE addresses
          SET
            user_id = ${address.userId},
            address_line1 = ${address.addressLine1},
            address_line2 = ${address.addressLine2},
            address_complement = ${address.addressComplement},
            zip_code = ${address.zipCode},
            city = ${address.city},
            country = ${address.country}
        WHERE address_id = ${address.addressId}
        RETURNING *
      `;
            if (result.rows.length === 0) return null;

            const row = result.rows[0];
            return {
                addressId: row.address_id,
                userId: row.user_id ?? undefined,
                addressLine1: row.address_line1 ?? undefined,
                addressLine2: row.address_line2 ?? undefined,
                addressComplement: row.address_complement ?? undefined,
                zipCode: row.zip_code ?? undefined,
                city: row.city ?? undefined,
                country: row.country ?? undefined,
            };
        } finally {
            client.release();
        }
    }

    /**
     * Hard delete example
     */
    async deleteAddress(addressId: number): Promise<boolean> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject`
        DELETE FROM addresses
        WHERE address_id = ${addressId}
      `;
            // result.rowCount = number of rows deleted
            return (result.rowCount || 0) > 0;
        } finally {
            client.release();
        }
    }
}
