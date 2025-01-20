// modules/invoices/invoice.routes.ts
import { Hono } from "hono";
import invoiceController from "./invoice.controller.ts";

const invoiceRouter = new Hono();
invoiceRouter.route("/", invoiceController);

export default invoiceRouter;
