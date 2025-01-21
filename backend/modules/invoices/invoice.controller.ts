// modules/invoices/invoice.controller.ts
import { Hono } from "hono";
import { invoiceService } from "./bll/invoice.service.ts";

const invoiceController = new Hono();

// GET /invoice
invoiceController.get("/", async (c) => {
    const invoices = await invoiceService.getAllInvoices();
    return c.json(invoices);
});

// GET /invoice/:invoiceId
invoiceController.get("/:invoiceId", async (c) => {
    const invoiceId = Number(c.req.param("invoiceId"));
    const invoice = await invoiceService.getInvoiceById(invoiceId);
    if (!invoice) {
        return c.json({ message: "Invoice not found" }, 404);
    }
    return c.json(invoice);
});

// POST /invoice
invoiceController.post("/", async (c) => {
    const body = await c.req.json();
    await invoiceService.createInvoice(body);
    return c.json({ message: "Invoice created" }, 201);
});

// PUT /invoice/:invoiceId
invoiceController.put("/:invoiceId", async (c) => {
    const invoiceId = Number(c.req.param("invoiceId"));
    const body = await c.req.json();
    await invoiceService.updateInvoice(invoiceId, body);
    return c.json({ message: "Invoice updated" });
});

// DELETE /invoice/:invoiceId
invoiceController.delete("/:invoiceId", async (c) => {
    const invoiceId = Number(c.req.param("invoiceId"));
    await invoiceService.deleteInvoice(invoiceId);
    return c.json({ message: "Invoice deleted" });
});

export default invoiceController;
