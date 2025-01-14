// modules/addresses/addresses.model.ts

export interface Address {
    addressId: number;
    userId?: number;
    addressLine1?: string;
    addressLine2?: string;
    addressComplement?: string;
    zipCode?: string;
    city?: string;
    country?: string;
}
