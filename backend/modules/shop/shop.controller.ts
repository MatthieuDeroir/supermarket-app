// modules/shop/shop.controller.ts
import { Hono } from "hono";
import shopService from "./bll/shop.service.ts";

// Declaration for TypeScript to recognize userId in context
declare module "hono" {
    interface ContextVariableMap {
        userId: number;
    }
}

const shopController = new Hono();

/**
 * POST /shop/close
 * Close the shop - returns all items from active carts back to shelves
 * This should be run at the end of the day
 */
shopController.post("/close", async (c) => {
    try {
        // Get user ID from context (set by auth middleware)
        const userId = c.get("userId");

        // If there's no user ID, use an admin ID (for development)
        const effectiveUserId = userId ?? 1; // Fallback to user ID 1 if needed

        const result = await shopService.closeShop(effectiveUserId);

        if (result.success) {
            return c.json({
                message: "Shop closed successfully",
                ...result
            }, 200);
        } else {
            return c.json({
                message: "Failed to close shop",
                ...result
            }, 500);
        }
    } catch (error) {
        console.error("Error in close shop endpoint:", error);
        return c.json({
            message: "Failed to close shop: " + (error instanceof Error ? error.message : String(error)),
            success: false
        }, 500);
    }
});

export default shopController;