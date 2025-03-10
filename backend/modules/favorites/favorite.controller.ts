// modules/favorites/favorite.controller.ts
import { Hono } from "hono";
import favoriteService from "./bll/favorite.service.ts";

// TypeScript declaration to recognize userId in context
declare module "hono" {
    interface ContextVariableMap {
        userId: number;
    }
}

const favoriteController = new Hono();

/**
 * GET /favorites
 * - Get all favorites for the authenticated user
 */
favoriteController.get("/", async (c) => {
    try {
        const userId = c.get("userId");
        const favorites = await favoriteService.getUserFavorites(userId);
        return c.json(favorites);
    } catch (error) {
        console.error("Error getting user favorites:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to get favorites"
        }, 500);
    }
});

/**
 * POST /favorites
 * - Add a product to the authenticated user's favorites
 * Body: { "productId": number }
 */
favoriteController.post("/", async (c) => {
    try {
        const userId = c.get("userId");
        const { productId } = await c.req.json();

        if (!productId || typeof productId !== "number") {
            return c.json({ error: "Valid productId is required" }, 400);
        }

        const favorite = await favoriteService.addFavorite({ userId, productId });
        return c.json(favorite, 201);
    } catch (error) {
        console.error("Error adding favorite:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to add favorite"
        }, 500);
    }
});

/**
 * DELETE /favorites/:productId
 * - Remove a product from the authenticated user's favorites
 */
favoriteController.delete("/:productId", async (c) => {
    try {
        const userId = c.get("userId");
        const productId = Number(c.req.param("productId"));

        if (isNaN(productId)) {
            return c.json({ error: "Valid productId is required" }, 400);
        }

        const removed = await favoriteService.removeFavorite(userId, productId);

        if (removed) {
            return c.json({ message: "Favorite removed successfully" });
        } else {
            return c.json({ message: "Favorite not found" }, 404);
        }
    } catch (error) {
        console.error("Error removing favorite:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to remove favorite"
        }, 500);
    }
});

/**
 * GET /favorites/check/:productId
 * - Check if a product is in the authenticated user's favorites
 */
favoriteController.get("/check/:productId", async (c) => {
    try {
        const userId = c.get("userId");
        const productId = Number(c.req.param("productId"));

        if (isNaN(productId)) {
            return c.json({ error: "Valid productId is required" }, 400);
        }

        const isFavorite = await favoriteService.isFavorite(userId, productId);
        return c.json({ isFavorite });
    } catch (error) {
        console.error("Error checking favorite status:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to check favorite status"
        }, 500);
    }
});

/**
 * GET /favorites/count/:productId
 * - Get the number of users who have favorited a product
 */
favoriteController.get("/count/:productId", async (c) => {
    try {
        const productId = Number(c.req.param("productId"));

        if (isNaN(productId)) {
            return c.json({ error: "Valid productId is required" }, 400);
        }

        const count = await favoriteService.getFavoriteCount(productId);
        return c.json({ count });
    } catch (error) {
        console.error("Error getting favorite count:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to get favorite count"
        }, 500);
    }
});

export default favoriteController;