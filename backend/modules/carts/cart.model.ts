// modules/carts/cart.model.ts
export interface Cart {
    [key: string]: unknown; // <= index signature
    cart_id: number;
    user_id: number;
    payed: boolean;
    createdAt: Date;
    payedAt?: Date | null;
}
