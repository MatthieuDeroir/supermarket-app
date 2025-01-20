// modules/invoices/bll/invoice.service.ts
import invoiceRepository from "../dal/invoice.repository.ts";
import invoiceLineRepository from "../dal/invoiceline.repository.ts";
import { Invoice } from "../invoice.model.ts";
import { InvoiceLine } from "../invoiceline.model.ts";

export interface InvoiceWithLines extends Invoice {
    lines: InvoiceLine[];
}

class InvoiceService {
    async getAllInvoices(): Promise<InvoiceWithLines[]> {
        const invoices = await invoiceRepository.findAll();
        const result: InvoiceWithLines[] = [];
        for (const inv of invoices) {
            const lines = await invoiceLineRepository.findByInvoiceId(inv.invoiceId);
            result.push({ ...inv, lines });
        }
        return result;
    }

    async getInvoiceById(invoiceId: number): Promise<InvoiceWithLines | null> {
        const invoice = await invoiceRepository.findById(invoiceId);
        if (!invoice) return null;

        const lines = await invoiceLineRepository.findByInvoiceId(invoiceId);
        return { ...invoice, lines };
    }

    async createInvoice(data: Omit<Invoice, "invoiceId">): Promise<void> {
        await invoiceRepository.create(data);
    }

    async updateInvoice(invoiceId: number, data: Partial<Invoice>): Promise<void> {
        await invoiceRepository.update(invoiceId, data);
    }

    async deleteInvoice(invoiceId: number): Promise<void> {
        await invoiceRepository.deleteById(invoiceId);
    }
}

export const invoiceService = new InvoiceService();
export default invoiceService;
