// modules/invoices/dto/invoice-create.dto.ts
export interface InvoiceCreateDto {
    userId: number;
    addressId: number;
    lines: {
        productId: string;
        quantity: number;
    }[];
}