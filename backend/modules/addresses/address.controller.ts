// modules/addresses/address.controller.ts
import { Hono } from "hono";
import addressService from "./bll/address.service.ts";

// TypeScript declaration to recognize userId in context
declare module "hono" {
    interface ContextVariableMap {
        userId: number;
    }
}

const addressController = new Hono();

/**
 * GET /addresses
 * - Get all addresses for the authenticated user (active and inactive)
 */
addressController.get("/", async (c) => {
    try {
        const userId = c.get("userId");
        const addresses = await addressService.getAllAddressesForUser(userId);
        return c.json(addresses);
    } catch (error) {
        console.error("Error getting addresses:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to get addresses"
        }, 500);
    }
});

/**
 * GET /addresses/active
 * - Get only active addresses for the authenticated user
 */
addressController.get("/active", async (c) => {
    try {
        const userId = c.get("userId");
        const addresses = await addressService.getActiveAddressesForUser(userId);
        return c.json(addresses);
    } catch (error) {
        console.error("Error getting active addresses:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to get active addresses"
        }, 500);
    }
});

/**
 * GET /addresses/:addressId
 * - Get a specific address by ID
 */
addressController.get("/:addressId", async (c) => {
    try {
        const addressId = Number(c.req.param("addressId"));
        const userId = c.get("userId");

        const address = await addressService.getAddressById(addressId);

        if (!address) {
            return c.json({ message: "Address not found" }, 404);
        }

        // Ensure the address belongs to the authenticated user
        if (address.user_id !== userId) {
            return c.json({ message: "Access denied" }, 403);
        }

        return c.json(address);
    } catch (error) {
        console.error("Error getting address:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to get address"
        }, 500);
    }
});

/**
 * POST /addresses
 * - Create a new address for the authenticated user
 */
addressController.post("/", async (c) => {
    try {
        const userId = c.get("userId");
        const body = await c.req.json();

        // Set the userId from the authenticated user
        const addressData = {
            ...body,
            userId
        };

        const newAddress = await addressService.createAddress(addressData);
        return c.json(newAddress, 201);
    } catch (error) {
        console.error("Error creating address:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to create address"
        }, 500);
    }
});

/**
 * PUT /addresses/:addressId
 * - Update an address
 */
addressController.put("/:addressId", async (c) => {
    try {
        const addressId = Number(c.req.param("addressId"));
        const userId = c.get("userId");
        const body = await c.req.json();

        // Verify the address belongs to the user
        const address = await addressService.getAddressById(addressId);
        if (!address) {
            return c.json({ message: "Address not found" }, 404);
        }

        if (address.user_id !== userId) {
            return c.json({ message: "Access denied" }, 403);
        }

        const updatedAddress = await addressService.updateAddress(addressId, body);
        return c.json(updatedAddress);
    } catch (error) {
        console.error("Error updating address:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to update address"
        }, 500);
    }
});

/**
 * PATCH /addresses/:addressId/deactivate
 * - Deactivate an address (soft delete)
 */
addressController.patch("/:addressId/deactivate", async (c) => {
    try {
        const addressId = Number(c.req.param("addressId"));
        const userId = c.get("userId");

        // Verify the address belongs to the user
        const address = await addressService.getAddressById(addressId);
        if (!address) {
            return c.json({ message: "Address not found" }, 404);
        }

        if (address.user_id !== userId) {
            return c.json({ message: "Access denied" }, 403);
        }

        const success = await addressService.deactivateAddress(addressId);

        if (success) {
            return c.json({ message: "Address deactivated successfully" });
        } else {
            return c.json({ message: "Failed to deactivate address" }, 500);
        }
    } catch (error) {
        console.error("Error deactivating address:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to deactivate address"
        }, 500);
    }
});

/**
 * PATCH /addresses/:addressId/activate
 * - Activate an address
 */
addressController.patch("/:addressId/activate", async (c) => {
    try {
        const addressId = Number(c.req.param("addressId"));
        const userId = c.get("userId");

        // Verify the address belongs to the user
        const address = await addressService.getAddressById(addressId);
        if (!address) {
            return c.json({ message: "Address not found" }, 404);
        }

        if (address.user_id !== userId) {
            return c.json({ message: "Access denied" }, 403);
        }

        const updatedAddress = await addressService.updateAddress(addressId, { active: true });

        if (updatedAddress) {
            return c.json({ message: "Address activated successfully", address: updatedAddress });
        } else {
            return c.json({ message: "Failed to activate address" }, 500);
        }
    } catch (error) {
        console.error("Error activating address:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to activate address"
        }, 500);
    }
});

/**
 * DELETE /addresses/:addressId
 * - Hard delete an address (use with caution)
 */
addressController.delete("/:addressId", async (c) => {
    try {
        const addressId = Number(c.req.param("addressId"));
        const userId = c.get("userId");

        // Verify the address belongs to the user
        const address = await addressService.getAddressById(addressId);
        if (!address) {
            return c.json({ message: "Address not found" }, 404);
        }

        if (address.user_id !== userId) {
            return c.json({ message: "Access denied" }, 403);
        }

        await addressService.deleteAddress(addressId);
        return c.json({ message: "Address deleted" });
    } catch (error) {
        console.error("Error deleting address:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to delete address"
        }, 500);
    }
});

export default addressController;