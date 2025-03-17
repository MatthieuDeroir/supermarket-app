export interface InvoiceLine {
    [key: string]: unknown; // Index signature
    invoice_line_id: number;
    product_id: string; // Ou `number` selon votre schéma
    quantity: number;
    price: number;
    invoice_id: number; // Clé étrangère
    created_at: Date;
}
