import invoiceRepository from "../dal/invoice.repository.ts";
import invoiceLineRepository from "../dal/invoiceline.repository.ts";
import userRepository from "../../users/dal/user.repository.ts";
import addressRepository from "../../addresses/dal/address.repository.ts";
import productRepository from "../../products/dal/product.repository.ts";
import { Invoice } from "../invoice.model.ts";
import { InvoiceLine } from "../invoiceline.model.ts";

export interface InvoiceWithLines extends Invoice {
    lines: InvoiceLine[];
}


export interface InvoiceWithDetails extends InvoiceWithLines {
    user: {
        user_id: number;
        name: string;
        email: string;
    };
    address: {
        address_id: number;
        street: string;
        city: string;
        country: string;
    };
    lines: Array<
        InvoiceLine & {
        product: {
            name: string;
            description: string;
            brand: string;
        };
    }
    >;
}


class InvoiceService {
    /**
     * Récupère toutes les invoices avec leurs lignes associées
     */
    async getAllInvoices(): Promise<InvoiceWithLines[]> {
        const invoices = await invoiceRepository.findAll();
        const result: InvoiceWithLines[] = [];
        for (const inv of invoices) {
            const lines = await invoiceLineRepository.findByInvoiceId(inv.invoice_id);
            result.push({ ...inv, lines });
        }
        return result;
    }

    /**
     * Récupère une invoice par son ID, avec ses lignes associées
     */
    async getInvoiceById(invoiceId: number): Promise<{
        [p: string]: unknown;
        address: { country: string; city: string; street: unknown; address_id: unknown };
        user_id: number;
        address_id: number;
        invoice_id: number;
        created_at: Date;
        lines: Awaited<{
            [p: string]: unknown;
            invoice_line_id: number;
            product: { name: string; description: string; brand: string };
            quantity: number;
            price: number;
            product_id: string;
            invoice_id: number;
            created_at: Date
        }>[];
        user: { user_id: unknown; name: unknown; email: string }
    }> {
        const invoice = await invoiceRepository.findById(invoiceId);
        if (!invoice) throw new Error("Invoice not found");

        const user = await userRepository.findById(invoice.user_id);
        const address = await addressRepository.findById(invoice.address_id);
        const lines = await invoiceLineRepository.findByInvoiceId(invoiceId);

        const detailedLines = await Promise.all(
            lines.map(async (line) => {
                const product = await productRepository.findById(line.product_id);
                return {
                    ...line,
                    product: {
                        name: product?.name ?? "Unknown",
                        description: product?.description ?? "No description",
                        brand: product?.brand ?? "Unknown",
                    },
                };
            })
        );

        return {
            ...invoice,
            user: {
                user_id: user?.user_id ?? 0,
                name: user?.name ?? "Unknown",
                email: user?.email ?? "Unknown",
            },
            address: {
                address_id: address?.address_id ?? 0,
                street: address?.street ?? "Unknown",
                city: address?.city ?? "Unknown",
                country: address?.country ?? "Unknown",
            },
            lines: detailedLines,
        };
    }

    /**
     * Get invoice by user_id
     */
    async getInvoicesByUserId(user_id: number): Promise<InvoiceWithDetails[]> {
        const invoices = await invoiceRepository.findByUserId(user_id);
        const result: InvoiceWithDetails[] = [];
        for (const inv of invoices) {
            const lines = await invoiceLineRepository.findByInvoiceId(inv.invoice_id);
            const user = await userRepository.findById(inv.user_id);
            const address = await addressRepository.findById(inv.address_id);
            const detailedLines = await Promise.all(
                lines.map(async (line) => {
                    const product = await productRepository.findById(line.product_id);
                    return {
                        ...line,
                        product: {
                            name: product?.name ?? "Unknown",
                            description: product?.description ?? "No description",
                            brand: product?.brand ?? "Unknown",
                        },
                    };
                })
            );
            result.push(<InvoiceWithDetails>{
                ...inv,
                user: {
                    user_id: user?.user_id ?? 0,
                    name: user?.name ?? "Unknown",
                    email: user?.email ?? "Unknown",
                },
                address: {
                    address_id: address?.address_id ?? 0,
                    street: address?.street ?? "Unknown",
                    city: address?.city ?? "Unknown",
                    country: address?.country ?? "Unknown",
                },
                lines: detailedLines,
            });
        }
        return result;
    }


    /**
     * Crée une nouvelle invoice
     */
    async createInvoice(data: Omit<Invoice, "invoice_id">): Promise<void> {
        await invoiceRepository.create(data);
    }

    /**
     * Met à jour une invoice existante
     */
    async updateInvoice(invoice_id: number, data: Partial<Invoice>): Promise<void> {
        await invoiceRepository.update(invoice_id, data);
    }

    /**
     * Supprime une invoice existante
     */
    async deleteInvoice(invoice_id: number): Promise<void> {
        await invoiceRepository.deleteById(invoice_id);
    }
}

export const invoiceService = new InvoiceService();
export default invoiceService;
