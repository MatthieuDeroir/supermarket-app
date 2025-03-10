
// InvoiceLine DTOs
import {BaseCreateDto, BaseResponseDto} from "../../generic.dto.ts";
import {ProductResponseDto} from "../../products/dto/product.dto.ts";

export interface InvoiceLineResponseDto extends BaseResponseDto {
    id: number; // Renamed from invoiceLineId
    productId: number;
    quantity: number;
    price: number;
    invoiceId: number;
    createdAt: Date;
    product?: ProductResponseDto;
}

export interface InvoiceLineCreateDto extends BaseCreateDto {
    productId: number;
    quantity: number;
    price: number;
    invoiceId: number;
}