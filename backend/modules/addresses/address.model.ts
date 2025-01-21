export interface Address {
    [key: string]: unknown; // <= index signature
    addressId: number;
    userId?: number;
    addressLine1?: string;
    addressLine2?: string;
    addressComplement?: string;
    zipCode?: string;
    city?: string;
    country?: string;
}
