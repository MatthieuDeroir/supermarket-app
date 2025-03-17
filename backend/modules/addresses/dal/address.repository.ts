// modules/addresses/dal/address.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { Address } from "../address.model.ts";
import db from "../../../config/database.ts";

export class AddressRepository extends GenericRepository<Address> {
    constructor() {
        super({
            tableName: "addresses",
            primaryKey: "address_id",
        });
    }

    /**
     * Find the active address for a user
     */
    async findActiveAddressByUserId(userId: number): Promise<Address | null> {
        const client = db.getClient();
        const query = `
            SELECT * FROM addresses
            WHERE user_id = $1 AND active = true
            LIMIT 1
        `;

        const result = await client.queryObject<Address>({
            text: query,
            args: [userId]
        });

        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Find all addresses for a user
     */
    async findByUserId(userId: number): Promise<Address[]> {
        const client = db.getClient();
        const query = `
            SELECT * FROM addresses
            WHERE user_id = $1
            ORDER BY active DESC, address_id DESC
        `;

        const result = await client.queryObject<Address>({
            text: query,
            args: [userId]
        });

        return result.rows;
    }

    /**
     * Set an address as active and all others as inactive for a user
     */
    async setAsActive(addressId: number, userId: number): Promise<boolean> {
        const client = db.getClient();

        try {
            await client.queryArray("BEGIN");

            // First, deactivate all addresses for the user
            const deactivateQuery = `
                UPDATE addresses
                SET active = false
                WHERE user_id = $1
            `;

            await client.queryArray({
                text: deactivateQuery,
                args: [userId]
            });

            // Then, activate the specified address
            const activateQuery = `
                UPDATE addresses
                SET active = true
                WHERE address_id = $1 AND user_id = $2
            `;

            const result = await client.queryArray({
                text: activateQuery,
                args: [addressId, userId]
            });

            await client.queryArray("COMMIT");

            // Return true if at least one row was affected
            if (result.rowCount != undefined)
                return result.rowCount > 0;
            else {
                console.error("Error setting active address: rowCount is undefined");
                return false;
            }

        } catch (error) {
            await client.queryArray("ROLLBACK");
            console.error("Error setting active address:", error);
            return false;
        }
    }
}

const addressRepository = new AddressRepository();
export default addressRepository;