import { Hono } from "hono";
import { invoiceService } from "./bll/invoice.service.ts";

const invoiceController = new Hono();

// GET /invoices
invoiceController.get("/", async (c) => {
    const invoices = await invoiceService.getAllInvoices();
    return c.json(invoices);
});

// GET /invoices/:invoice_id
invoiceController.get("/:invoice_id", async (c) => {
    const invoice_id = Number(c.req.param("invoice_id"));
    const invoice = await invoiceService.getInvoiceById(invoice_id);
    if (!invoice) {
        return c.json({ message: "Invoice not found" }, 404);
    }
    return c.json(invoice);
});

// GET /invoices/user/:user_id
invoiceController.get("/user/:user_id", async (c) => {
    const user_id = Number(c.req.param("user_id"));
    const invoices = await invoiceService.getInvoicesByUserId(user_id);
    return c.json(invoices);
});

// POST /invoices
invoiceController.post("/", async (c) => {
    const body = await c.req.json();
    const user_id = c.get("userId");
    await invoiceService.createInvoice(body, user_id);
    return c.json({ message: "Invoice created" }, 201);
});

// PUT /invoices/:invoice_id
invoiceController.put("/:invoice_id", async (c) => {
    const invoice_id = Number(c.req.param("invoice_id"));
    const body = await c.req.json();

    const user_id = c.get("userId");
    await invoiceService.updateInvoice(invoice_id, body, user_id);
    return c.json({ message: "Invoice updated" });
});

// DELETE /invoices/:invoice_id
invoiceController.delete("/:invoice_id", async (c) => {
    const invoice_id = Number(c.req.param("invoice_id"));
    const user_id = c.get("userId");
    await invoiceService.deleteInvoice(invoice_id, user_id);
    return c.json({ message: "Invoice deleted" });
});



export default invoiceController;
