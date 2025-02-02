export interface InvoiceResponseDto {
    invoiceId: number;
    userId: number;
    addressId: number;
    createdAt: string;
    invoiceLines: InvoiceLineResponseDto[];
}

export interface InvoiceLineResponseDto {
    invoiceLineId: number;
    productId: number;
    quantity: number;
    price: number;
    createdAt: string;
}