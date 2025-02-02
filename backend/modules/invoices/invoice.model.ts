// modules/invoices/invoice.model.ts
export interface Invoice {
    [key: string]: unknown; // <= index signature
    invoice_id: number;
    user_id: number;
    address_id: number;
    cart_id: number; // Ajout de l'ID du panier
    created_at: Date;
}
