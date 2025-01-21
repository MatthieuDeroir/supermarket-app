// modules/invoices/invoiceline.model.ts
export interface InvoiceLine {
    [key: string]: unknown; // <= index signature
    invoiceLineId: number;
    productId: string; // ou number
    quantity: number;
    price: number;
    invoiceId: number;  // clé étrangère
    createdAt: Date;
}
