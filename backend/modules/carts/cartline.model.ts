// modules/carts/cartline.model.ts
export interface CartLine {
    [key: string]: unknown; // <= index signature
    cart_line_id: number;
    product_id: string;   // ou number, selon votre schéma
    quantity: number;
    cart_id: number;      // clé étrangère vers Cart
    createdAt: Date;
}
