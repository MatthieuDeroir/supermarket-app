// modules/addresses/dto/address-update.dto.ts

export interface AddressUpdateDto {
    addressId: number;
    userId?: number;
    addressLine1?: string;
    addressLine2?: string;
    addressComplement?: string;
    zipCode?: string;
    city?: string;
    country?: string;
}
