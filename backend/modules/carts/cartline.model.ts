// modules/carts/cartline.model.ts
export interface CartLine {
    [key: string]: unknown; // <= index signature
    cartLineId: number;
    productId: string;   // ou number, selon votre schéma
    quantity: number;
    cartId: number;      // clé étrangère vers Cart
    createdAt: Date;
}
