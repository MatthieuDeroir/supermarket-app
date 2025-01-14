// modules/addresses/dto/address-response.dto.ts

/**
 * The shape of the Address data we return to the client,
 * usually omitting or transforming fields we don't want
 * to expose directly.
 */
export interface AddressResponseDto {
    addressId: number;
    userId?: number;
    addressLine1?: string;
    addressLine2?: string;
    addressComplement?: string;
    zipCode?: string;
    city?: string;
    country?: string;
}
