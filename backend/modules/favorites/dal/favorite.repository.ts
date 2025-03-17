// modules/favorites/dal/favorite.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { Favorite } from "../favorite.model.ts";
import db from "../../../config/database.ts";

export class FavoriteRepository extends GenericRepository<Favorite> {
    constructor() {
        super({
            tableName: "favorites",
            primaryKey: "favorite_id",
        });
    }

    /**
     * Find all favorites for a specific user
     */
    async findByUserId(userId: number): Promise<Favorite[]> {
        const client = db.getClient();
        const query = `
            SELECT * FROM favorites 
            WHERE user_id = $1
            ORDER BY created_at DESC
        `;
        const result = await client.queryObject<Favorite>({
            text: query,
            args: [userId]
        });
        return result.rows;
    }

    /**
     * Find all users who favorited a specific product
     */
    async findByProductId(productId: number): Promise<Favorite[]> {
        const client = db.getClient();
        const query = `
            SELECT * FROM favorites 
            WHERE product_id = $1
            ORDER BY created_at DESC
        `;
        const result = await client.queryObject<Favorite>({
            text: query,
            args: [productId]
        });
        return result.rows;
    }

    /**
     * Check if a user has favorited a specific product
     */
    async findByUserAndProduct(userId: number, productId: number): Promise<Favorite | null> {
        const client = db.getClient();
        const query = `
            SELECT * FROM favorites 
            WHERE user_id = $1 AND product_id = $2
            LIMIT 1
        `;
        const result = await client.queryObject<Favorite>({
            text: query,
            args: [userId, productId]
        });
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Get total number of favorites for a product
     */
    async countByProductId(productId: number): Promise<number> {
        const client = db.getClient();
        const query = `
            SELECT COUNT(*) as count 
            FROM favorites 
            WHERE product_id = $1
        `;
        const result = await client.queryObject<{ count: number }>({
            text: query,
            args: [productId]
        });
        return parseInt(result.rows[0].count.toString());
    }

    /**
     * Remove a favorite by user and product IDs
     */
    async removeByUserAndProduct(userId: number, productId: number): Promise<boolean> {
        const client = db.getClient();
        const query = `
            DELETE FROM favorites 
            WHERE user_id = $1 AND product_id = $2
            RETURNING favorite_id
        `;
        const result = await client.queryObject<{ favorite_id: number }>({
            text: query,
            args: [userId, productId]
        });
        return result.rows.length > 0;
    }
}

const favoriteRepository = new FavoriteRepository();
export default favoriteRepository;