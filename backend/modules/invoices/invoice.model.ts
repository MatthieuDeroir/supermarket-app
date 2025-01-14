// modules/invoices/invoice.model.ts
export interface Invoice {
    invoiceId: number;
    userId: number;
    addressId: number;
    createdAt: Date;
}

export interface InvoiceLine {
    invoiceLineId: number;
    productId: string;
    quantity: number;
    price: number;
    invoiceId: number;
    createdAt: Date;
}