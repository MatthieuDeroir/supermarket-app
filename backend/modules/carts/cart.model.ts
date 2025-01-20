// modules/carts/cart.model.ts
export interface Cart {
    [key: string]: unknown; // <= index signature
    cartId: number;
    userId: number;
    createdAt: Date;
}
