// modules/favorites/bll/favorite.service.ts
import favoriteRepository from "../dal/favorite.repository.ts";
import productRepository from "../../products/dal/product.repository.ts";
import userRepository from "../../users/dal/user.repository.ts";
import { FavoriteResponseDto, FavoriteCreateDto } from "../dto/favorite.dto.ts";
import { Favorite } from "../favorite.model.ts";

class FavoriteService {
    /**
     * Add a product to user's favorites
     */
    async addFavorite(data: FavoriteCreateDto): Promise<FavoriteResponseDto> {
        // Check if the user and product exist
        const user = await userRepository.findById(data.userId);
        if (!user) {
            throw new Error(`User with ID ${data.userId} not found`);
        }

        const product = await productRepository.findById(data.productId);
        if (!product) {
            throw new Error(`Product with ID ${data.productId} not found`);
        }

        // Check if this product is already a favorite
        const existingFavorite = await favoriteRepository.findByUserAndProduct(data.userId, data.productId);
        if (existingFavorite) {
            return this.mapToResponseDto(existingFavorite);
        }

        // Add to favorites
        const favoriteData = {
            user_id: data.userId,
            product_id: data.productId,
            created_at: new Date()
        };

        await favoriteRepository.create(favoriteData);

        // Get the created favorite
        const newFavorite = await favoriteRepository.findByUserAndProduct(data.userId, data.productId);
        if (!newFavorite) {
            throw new Error("Failed to create favorite");
        }

        return this.mapToResponseDto(newFavorite);
    }

    /**
     * Remove a product from user's favorites
     */
    async removeFavorite(userId: number, productId: number): Promise<boolean> {
        return await favoriteRepository.removeByUserAndProduct(userId, productId);
    }

    /**
     * Get all favorites for a user
     */
    async getUserFavorites(userId: number): Promise<FavoriteResponseDto[]> {
        const favorites = await favoriteRepository.findByUserId(userId);
        const results: FavoriteResponseDto[] = [];

        for (const favorite of favorites) {
            results.push(await this.mapToResponseDto(favorite));
        }

        return results;
    }

    /**
     * Check if a product is in user's favorites
     */
    async isFavorite(userId: number, productId: number): Promise<boolean> {
        const favorite = await favoriteRepository.findByUserAndProduct(userId, productId);
        return favorite !== null;
    }

    /**
     * Get count of users who favorited a product
     */
    async getFavoriteCount(productId: number): Promise<number> {
        return await favoriteRepository.countByProductId(productId);
    }

    /**
     * Helper to map DB model to response DTO
     */
    private async mapToResponseDto(favorite: Favorite): Promise<FavoriteResponseDto> {
        const product = await productRepository.findById(favorite.product_id);

        return {
            id: favorite.favorite_id,
            userId: favorite.user_id,
            productId: favorite.product_id,
            createdAt: favorite.created_at,
            product: product ? {
                id: product.product_id,
                ean: product.ean,
                name: product.name,
                brand: product.brand,
                description: product.description,
                picture: product.picture,
                nutritionalInformation: product.nutritional_information,
                price: product.price,
                stockWarehouse: product.stock_warehouse ?? 0,
                stockShelfBottom: product.stock_shelf_bottom ?? 0,
                minimumStock: product.minimum_stock,
                minimumShelfStock: product.minimum_shelf_stock,
                categoryId: product.category_id
            } : undefined
        };
    }
}

export const favoriteService = new FavoriteService();
export default favoriteService;