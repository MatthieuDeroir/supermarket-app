import addressRepository from "../dal/address.repository.ts";
import { Address } from "../address.model.ts";

/**
 * Couche métier : applique des règles, validations, etc.
 */
class AddressService {
    /**
     * Récupère toutes les adresses
     */
    async getAllAddress(): Promise<Address[]> {
        return await addressRepository.findAll();
    }

    /**
     * Récupère une adresse par son addressId
     */
    async getAddressById(addressId: number): Promise<Address | null> {
        return await addressRepository.findById(addressId);
    }

    /**
     * Crée une nouvelle adresse
     */
    async createAddress(data: Omit<Address, "addressId">): Promise<void> {
        // Vous pouvez faire des validations ou nettoyages ici
        // ex.: if (!data.city) throw new Error("City is required");
        await addressRepository.create(data);
    }

    /**
     * Met à jour une adresse existante
     */
    async updateAddress(addressId: number, data: Partial<Address>): Promise<void> {
        // Règles métier éventuelles, validations, ...
        await addressRepository.update(addressId, data);
    }

    /**
     * Supprime une adresse (hard-delete)
     */
    async deleteAddress(addressId: number): Promise<void> {
        await addressRepository.deleteById(addressId);
    }
}

// On exporte une instance unique
const addressService = new AddressService();
export default addressService;
