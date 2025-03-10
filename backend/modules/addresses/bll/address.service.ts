// modules/addresses/bll/address.service.ts
import addressRepository from "../dal/address.repository.ts";
import { Address } from "../address.model.ts";
import { AddressResponseDto, AddressCreateDto, AddressUpdateDto } from "../dto/address.dto.ts";
import db from "../../../config/database.ts";

class AddressService {
    /**
     * Convert Address to AddressResponseDto
     */
    private mapToResponseDto(address: Address): AddressResponseDto {
        return {
            address_id: address.address_id,
            user_id: address.user_id,
            address_line1: address.address_line1 || '', // Ensure string
            address_line2: address.address_line2 || undefined,
            address_complement: address.address_complement || undefined,
            zip_code: address.zip_code || '',
            city: address.city || '',
            country: address.country || '',
            active: address.active || false
        };
    }

    /**
     * Get all addresses
     */
    async getAllAddress(): Promise<AddressResponseDto[]> {
        const addresses = await addressRepository.findAll();
        return addresses.map(this.mapToResponseDto);
    }

    /**
     * Get the active address for a user (single one)
     */
    async getActiveAddressForUser(userId: number): Promise<AddressResponseDto | null> {
        const address = await addressRepository.findActiveAddressByUserId(userId);
        return address ? this.mapToResponseDto(address) : null;
    }

    /**
     * Get all active addresses for a user
     */
    async getActiveAddressesForUser(userId: number): Promise<AddressResponseDto[]> {
        const client = (await import("../../../config/database.ts")).default.getClient();

        const query = `
            SELECT * FROM addresses
            WHERE user_id = $1 AND active = true
            ORDER BY address_id DESC
        `;

        const result = await client.queryObject<Address>({
            text: query,
            args: [userId]
        });

        return result.rows.map(this.mapToResponseDto);
    }

    /**
     * Get all addresses for a user (active and inactive)
     */
    async getAllAddressesForUser(userId: number): Promise<AddressResponseDto[]> {
        const addresses = await addressRepository.findByUserId(userId);
        return addresses.map(this.mapToResponseDto);
    }

    /**
     * Get an address by ID
     */
    async getAddressById(addressId: number): Promise<AddressResponseDto | null> {
        const address = await addressRepository.findById(addressId);
        return address ? this.mapToResponseDto(address) : null;
    }

    /**
     * Create a new address
     * If setting as active, deactivates all other addresses for this user
     */
    async createAddress(data: AddressCreateDto): Promise<AddressResponseDto> {
        const client = db.getClient();

        try {
            await client.queryArray("BEGIN");

            // Determine if we should make this address active
            const makeActive = data.active !== false; // Default to true if undefined

            if (makeActive) {
                // Deactivate all other addresses for this user
                const deactivateQuery = `
                    UPDATE addresses
                    SET active = false
                    WHERE user_id = $1
                `;

                await client.queryArray({
                    text: deactivateQuery,
                    args: [data.user_id]
                });
            }

            // Create the address with appropriate active flag
            const addressData: Omit<Address, "address_id"> = {
                user_id: data.user_id,
                address_line1: data.address_line1,
                address_line2: data.address_line2,
                address_complement: data.address_complement,
                zip_code: data.zip_code,
                city: data.city,
                country: data.country,
                active: makeActive
            };

            await addressRepository.create(addressData);

            await client.queryArray("COMMIT");

            // Get the created address
            const addresses = await this.getAllAddressesForUser(data.user_id);
            const newAddress = addresses[0]; // Should be the first one (most recent)

            if (!newAddress) {
                throw new Error("Failed to create address");
            }

            return newAddress;
        } catch (error) {
            await client.queryArray("ROLLBACK");
            console.error("Error creating address:", error);
            throw error;
        }
    }

    /**
     * Update an address
     * If setting as active, deactivates all other addresses for this user
     */
    async updateAddress(addressId: number, data: AddressUpdateDto, userId: number): Promise<AddressResponseDto | null> {
        const client = db.getClient();

        try {
            await client.queryArray("BEGIN");

            const address = await addressRepository.findById(addressId);
            if (!address) {
                await client.queryArray("ROLLBACK");
                return null;
            }

            // Ensure the address belongs to the user
            if (address.user_id !== userId) {
                await client.queryArray("ROLLBACK");
                throw new Error("Cannot update an address that doesn't belong to you");
            }

            // Check if we're setting this address as active
            if (data.active === true) {
                // Deactivate all other addresses for this user
                const deactivateQuery = `
                    UPDATE addresses
                    SET active = false
                    WHERE user_id = $1 AND address_id != $2
                `;

                await client.queryArray({
                    text: deactivateQuery,
                    args: [userId, addressId]
                });
            }

            // Convert DTO to DB model
            const updateData: Partial<Address> = {};

            if (data.address_line1 !== undefined) updateData.address_line1 = data.address_line1;
            if (data.address_line2 !== undefined) updateData.address_line2 = data.address_line2;
            if (data.address_complement !== undefined) updateData.address_complement = data.address_complement;
            if (data.zip_code !== undefined) updateData.zip_code = data.zip_code;
            if (data.city !== undefined) updateData.city = data.city;
            if (data.country !== undefined) updateData.country = data.country;
            if (data.active !== undefined) updateData.active = data.active;

            await addressRepository.update(addressId, updateData);

            await client.queryArray("COMMIT");

            const updatedAddress = await addressRepository.findById(addressId);
            return updatedAddress ? this.mapToResponseDto(updatedAddress) : null;
        } catch (error) {
            await client.queryArray("ROLLBACK");
            console.error("Error updating address:", error);
            throw error;
        }
    }

    /**
     * Set an address as active
     */
    async setAddressActive(addressId: number, userId: number): Promise<boolean> {
        return await addressRepository.setAsActive(addressId, userId);
    }

    /**
     * Deactivate an address (soft delete)
     */
    async deactivateAddress(addressId: number, userId: number): Promise<boolean> {
        const address = await addressRepository.findById(addressId);
        if (!address) return false;

        // Ensure the address belongs to the user
        if (address.user_id !== userId) {
            throw new Error("Cannot update an address that doesn't belong to you");
        }

        await addressRepository.update(addressId, { active: false });
        return true;
    }

    /**
     * Hard delete an address - use with caution
     */
    async deleteAddress(addressId: number, userId: number): Promise<void> {
        const address = await addressRepository.findById(addressId);
        if (!address) {
            throw new Error("Address not found");
        }

        // Ensure the address belongs to the user
        if (address.user_id !== userId) {
            throw new Error("Cannot delete an address that doesn't belong to you");
        }

        await addressRepository.deleteById(addressId);
    }
}

const addressService = new AddressService();
export default addressService;