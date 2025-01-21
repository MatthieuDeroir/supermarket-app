// modules/invoices/invoice.model.ts
export interface Invoice {
    [key: string]: unknown; // <= index signature
    invoiceId: number;
    userId: number;
    addressId: number;
    createdAt: Date;
}
