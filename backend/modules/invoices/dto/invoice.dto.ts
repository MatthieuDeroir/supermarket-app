// Invoice DTOs
import {BaseCreateDto, BaseResponseDto, BaseUpdateDto} from "../../generic.dto.ts";
import {UserResponseDto} from "../../users/dto/user.dto.ts";
import {AddressResponseDto} from "../../addresses/dto/address.dto.ts";
import {InvoiceLineResponseDto} from "./invoiceline.dto.ts";

export interface InvoiceResponseDto extends BaseResponseDto {
    id: number; // Renamed from invoiceId
    userId: number;
    addressId: number;
    cartId: number;
    createdAt: Date;
    lines: InvoiceLineResponseDto[];
    address?: AddressResponseDto;
    user?: UserResponseDto;
    total?: number;
}

export interface InvoiceCreateDto extends BaseCreateDto {
    userId: number;
    addressId: number;
    cartId: number;
}

export interface InvoiceUpdateDto extends BaseUpdateDto {
    // Usually invoices shouldn't be updated after creation
}
