// modules/invoices/invoice.controller.ts
import { Hono } from "hono";
import { invoiceService } from "./bll/invoice.service.ts";

// Declaration for TypeScript to recognize userId in context
declare module "hono" {
    interface ContextVariableMap {
        userId: number;
    }
}

const invoiceController = new Hono();

/**
 * GET /invoices
 * - Get all invoices (admin only)
 */
invoiceController.get("/", async (c) => {
    try {
        // In a real application, you might want to check if the user is an admin here
        const invoices = await invoiceService.getAllInvoices();
        return c.json(invoices);
    } catch (error) {
        console.error("Error getting all invoices:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to get invoices"
        }, 500);
    }
});

/**
 * GET /invoices/my
 * - Get all invoices for the authenticated user
 */
invoiceController.get("/my", async (c) => {
    try {
        const userId = c.get("userId");
        if (!userId) {
            return c.json({ error: "Authentication required" }, 401);
        }

        const invoices = await invoiceService.getInvoicesByUserId(userId);
        return c.json(invoices);
    } catch (error) {
        console.error("Error getting user invoices:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to get invoices"
        }, 500);
    }
});

/**
 * GET /invoices/:invoiceId
 * - Get a specific invoice by ID (only if it belongs to the authenticated user)
 */
invoiceController.get("/:invoiceId", async (c) => {
    try {
        const invoiceId = Number(c.req.param("invoiceId"));
        const userId = c.get("userId");

        if (!userId) {
            return c.json({ error: "Authentication required" }, 401);
        }

        const invoice = await invoiceService.getInvoiceById(invoiceId);

        if (!invoice) {
            return c.json({ message: "Invoice not found" }, 404);
        }

        // Check if the invoice belongs to the authenticated user (unless they're an admin)
        // For simplicity, we'll just check owner
        if (invoice.userId !== userId) {
            return c.json({ message: "Access denied" }, 403);
        }

        return c.json(invoice);
    } catch (error) {
        console.error("Error getting invoice:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to get invoice"
        }, 500);
    }
});

/**
 * GET /invoices/user/:userId (admin only)
 * - Get all invoices for a specific user
 */
invoiceController.get("/user/:userId", async (c) => {
    try {
        // In a real application, you might want to check if the user is an admin here
        const targetUserId = Number(c.req.param("userId"));
        const invoices = await invoiceService.getInvoicesByUserId(targetUserId);
        return c.json(invoices);
    } catch (error) {
        console.error("Error getting user invoices:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to get invoices"
        }, 500);
    }
});

/**
 * DELETE /invoices/:invoiceId (admin only)
 * - Delete an invoice
 */
invoiceController.delete("/:invoiceId", async (c) => {
    try {
        // In a real application, you might want to check if the user is an admin here
        const invoiceId = Number(c.req.param("invoiceId"));
        const userId = c.get("userId");

        if (!userId) {
            return c.json({ error: "Authentication required" }, 401);
        }

        await invoiceService.deleteInvoice(invoiceId, userId);
        return c.json({ message: "Invoice deleted" });
    } catch (error) {
        console.error("Error deleting invoice:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to delete invoice"
        }, 500);
    }
});

export default invoiceController;