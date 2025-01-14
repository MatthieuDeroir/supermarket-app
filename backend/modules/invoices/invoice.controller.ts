// modules/invoices/invoice.controller.ts
import { Context } from "../../deps.ts";
import { InvoiceRepository } from "./dal/invoice.repository.ts";
import { InvoiceService } from "./bll/invoice.service.ts";
import { ProductRepository } from "../products/dal/product.repository.ts";
import { ProductService } from "../products/bll/product.service.ts";
import { InvoiceCreateDto } from "./dto/invoice-create.dto.ts";

const invoiceRepo = new InvoiceRepository();
const productRepo = new ProductRepository();
const productService = new ProductService(productRepo);
const service = new InvoiceService(invoiceRepo, productService);

export async function createInvoiceHandler(c: Context) {
    try {
        const body = await c.req.json();
        const dto = body as InvoiceCreateDto;
        const invoice = await service.createInvoice(dto);
        return c.json(invoice, 201);
    } catch (err) {
        if (err instanceof Error) {
            return c.text(err.message, 400);
        }
        return c.text("Unknown error", 500);
    }
}
