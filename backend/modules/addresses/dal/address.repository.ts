// modules/addresses/dal/address.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { Address } from "../address.model.ts";



export class AddressRepository extends GenericRepository<Address> {
    constructor() {
        super({
            tableName: "Addresses",
            primaryKey: "addressId", // <-- la PK
        });
    }

    // Méthodes spécifiques à "addresses" si besoin
    // par ex. findByCity, findByUserId, etc.
}

const addressRepository = new AddressRepository();
export default addressRepository;
