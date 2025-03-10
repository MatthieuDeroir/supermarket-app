// modules/addresses/bll/address.service.ts
import addressRepository from "../dal/address.repository.ts";
import { Address } from "../address.model.ts";
import { AddressResponseDto, AddressCreateDto, AddressUpdateDto } from "../dto/address.dto.ts";

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
     * Get active addresses for a user
     */
    async getActiveAddressesForUser(user_id: number): Promise<AddressResponseDto[]> {
        const client = (await import("../../../config/database.ts")).default.getClient();

        const query = `
            SELECT * FROM addresses
            WHERE user_id = $1 AND active = true
            ORDER BY address_id DESC
        `;

        const result = await client.queryObject<Address>({
            text: query,
            args: [user_id]
        });

        return result.rows.map(this.mapToResponseDto);
    }

    /**
     * Get all addresses for a user (active and inactive)
     */
    async getAllAddressesForUser(user_id: number): Promise<AddressResponseDto[]> {
        const client = (await import("../../../config/database.ts")).default.getClient();

        const query = `
      SELECT * FROM addresses 
      WHERE user_id = $1
      ORDER BY active DESC, address_id DESC
    `;

        const result = await client.queryObject<Address>({
            text: query,
            args: [user_id]
        });

        return result.rows.map(this.mapToResponseDto);
    }

    /**
     * Get an address by ID
     */
    async getAddressById(address_id: number): Promise<AddressResponseDto | null> {
        const address = await addressRepository.findById(address_id);
        return address ? this.mapToResponseDto(address) : null;
    }

    /**
     * Create a new address
     */
    async createAddress(data: AddressCreateDto): Promise<AddressResponseDto> {
        // Ensure all required fields are present
        const addressData: Omit<Address, "address_id"> = {
            user_id: data.user_id,
            address_line1: data.address_line1,
            address_line2: data.address_line2,
            address_complement: data.address_complement,
            zip_code: data.zip_code,
            city: data.city,
            country: data.country,
            active: data.active !== undefined ? data.active : true
        };

        await addressRepository.create(addressData);

        // Get the created address (not ideal, but works for now)
        const allAddresses = await this.getAllAddressesForUser(data.user_id);
        const newAddress = allAddresses[0]; // Should be the most recent one

        if (!newAddress) {
            throw new Error("Failed to create address");
        }

        return newAddress;
    }

    /**
     * Update an address
     */
    async updateAddress(address_id: number, data: AddressUpdateDto): Promise<AddressResponseDto | null> {
        const address = await addressRepository.findById(address_id);
        if (!address) return null;

        // Convert DTO to DB model
        const updateData: Partial<Address> = {};

        if (data.address_line1 !== undefined) updateData.address_line1 = data.address_line1;
        if (data.address_line2 !== undefined) updateData.address_line2 = data.address_line2;
        if (data.address_complement !== undefined) updateData.address_complement = data.address_complement;
        if (data.zip_code !== undefined) updateData.zip_code = data.zip_code;
        if (data.city !== undefined) updateData.city = data.city;
        if (data.country !== undefined) updateData.country = data.country;
        if (data.active !== undefined) updateData.active = data.active;

        await addressRepository.update(address_id, updateData);

        const updatedAddress = await addressRepository.findById(address_id);
        return updatedAddress ? this.mapToResponseDto(updatedAddress) : null;
    }

    /**
     * Deactivate an address (soft delete)
     */
    async deactivateAddress(address_id: number): Promise<boolean> {
        const address = await addressRepository.findById(address_id);
        if (!address) return false;

        await addressRepository.update(address_id, { active: false });
        return true;
    }

    /**
     * Hard delete an address - use with caution
     */
    async deleteAddress(address_id: number): Promise<void> {
        await addressRepository.deleteById(address_id);
    }
}

const addressService = new AddressService();
export default addressService;