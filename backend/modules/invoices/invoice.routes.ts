// modules/invoices/invoice.routes.ts
import { Hono } from "../../deps.ts";
import { createInvoiceHandler } from "./invoice.controller.ts";

const invoiceRoutes = new Hono();

invoiceRoutes.post("/", createInvoiceHandler);

export default invoiceRoutes;