// modules/addresses/bll/addresses.service.ts

import { AddressesRepository } from "../dal/address.repository.ts";
import { Address } from "../address.model.ts";
import { AddressCreateDto } from "../dto/address-create.dto.ts";
import { AddressUpdateDto } from "../dto/address-update.dto.ts";

export class AddressesService {
    constructor(private repo: AddressesRepository) {}

    async createAddress(dto: AddressCreateDto): Promise<Address> {
        // Example: check if userId is valid, or if city is required, etc.
        // For now, just pass it along:
        const address: Address = {
            addressId: 0,
            userId: dto.userId,
            addressLine1: dto.addressLine1,
            addressLine2: dto.addressLine2,
            addressComplement: dto.addressComplement,
            zipCode: dto.zipCode,
            city: dto.city,
            country: dto.country,
        };
        return await this.repo.createAddress(address);
    }

    async getAddressById(addressId: number): Promise<Address | null> {
        return await this.repo.findById(addressId);
    }

    async findAddressesByUser(userId: number): Promise<Address[]> {
        return await this.repo.findByUserId(userId);
    }

    async updateAddress(dto: AddressUpdateDto): Promise<Address | null> {
        // We could do more checks, e.g. ensure address belongs to user, etc.
        const address: Address = {
            addressId: dto.addressId,
            userId: dto.userId,
            addressLine1: dto.addressLine1,
            addressLine2: dto.addressLine2,
            addressComplement: dto.addressComplement,
            zipCode: dto.zipCode,
            city: dto.city,
            country: dto.country,
        };
        return await this.repo.updateAddress(address);
    }

    async deleteAddress(addressId: number): Promise<boolean> {
        return await this.repo.deleteAddress(addressId);
    }
}
