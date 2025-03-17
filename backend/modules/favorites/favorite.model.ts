// modules/favorites/favorite.model.ts
export interface Favorite {
    [key: string]: unknown; // <= index signature
    favorite_id: number;
    user_id: number;
    product_id: number;
    created_at: Date;
}