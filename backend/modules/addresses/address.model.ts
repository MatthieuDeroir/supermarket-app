export interface Address {
    [key: string]: unknown; // <= index signature
    address_id: number;
    user_id?: number;
    addressLine1?: string;
    addressLine2?: string;
    addressComplement?: string;
    zipCode?: string;
    city?: string;
    country?: string;
}
