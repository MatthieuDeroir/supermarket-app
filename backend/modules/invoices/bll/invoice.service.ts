// modules/invoices/bll/invoice.service.ts
import { InvoiceRepository } from "../dal/invoice.repository.ts";
import { Invoice, InvoiceLine } from "../invoice.model.ts";
import { InvoiceCreateDto } from "../dto/invoice-create.dto.ts";
import { ProductService } from "../../products/bll/product.service.ts";

export class InvoiceService {
    constructor(
        private invoiceRepo: InvoiceRepository,
        private productService: ProductService
    ) {}

    async createInvoice(dto: InvoiceCreateDto): Promise<Invoice> {
        const invoice: Invoice = {
            invoiceId: 0,
            userId: dto.userId,
            addressId: dto.addressId,
            createdAt: new Date()
        };

        const createdInvoice = await this.invoiceRepo.createInvoice(invoice);

        // Create invoice lines
        for (const line of dto.lines) {
            const product = await this.productService.getProduct(line.productId);
            if (!product) {
                throw new Error(`Product ${line.productId} not found`);
            }

            const invoiceLine: InvoiceLine = {
                invoiceLineId: 0,
                productId: line.productId,
                quantity: line.quantity,
                price: product.price,
                invoiceId: createdInvoice.invoiceId,
                createdAt: new Date()
            };

            await this.invoiceRepo.createInvoiceLine(invoiceLine);
        }

        return createdInvoice;
    }
}