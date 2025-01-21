// modules/addresses/dto/address-create.dto.ts
export interface AddressCreateDto {
    userId: number;
    addressLine1: string;
    addressLine2?: string;
    addressComplement?: string;
    zipCode: string;
    city: string;
    country: string;
}
