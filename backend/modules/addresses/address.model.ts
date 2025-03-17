// modules/addresses/address.model.ts
export interface Address {
    [key: string]: unknown; // <= index signature
    address_id: number;
    user_id: number;
    address_line1?: string;
    address_line2?: string;
    address_complement?: string;
    zip_code?: string;
    city?: string;
    country?: string;
    active?: boolean;
}