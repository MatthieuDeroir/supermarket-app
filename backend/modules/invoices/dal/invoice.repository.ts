// modules/invoices/dal/invoice.repository.ts
import { getDBClient } from "../../../config/database.ts";
import { Invoice, InvoiceLine } from "../invoice.model.ts";

export class InvoiceRepository {
    async createInvoice(invoice: Invoice): Promise<Invoice> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                invoice_id: number;
                user_id: number;
                address_id: number;
                created_at: Date;
            }>`
                INSERT INTO invoices
                (user_id, address_id, created_at)
                VALUES (${invoice.userId}, ${invoice.addressId}, ${invoice.createdAt})
                RETURNING *
            `;

            return {
                invoiceId: result.rows[0].invoice_id,
                userId: result.rows[0].user_id,
                addressId: result.rows[0].address_id,
                createdAt: result.rows[0].created_at,
            };
        } finally {
            client.release();
        }
    }

    async createInvoiceLine(line: InvoiceLine): Promise<InvoiceLine> {
        const client = await getDBClient();
        try {
            const result = await client.queryObject<{
                invoice_line_id: number;
                product_id: string;
                quantity: number;
                price: number;
                invoice_id: number;
                created_at: Date;
            }>`
                INSERT INTO invoice_lines
                (product_id, quantity, price, invoice_id, created_at)
                VALUES
                (${line.productId}, ${line.quantity}, ${line.price},
                 ${line.invoiceId}, ${line.createdAt})
                RETURNING *
            `;

            return {
                invoiceLineId: result.rows[0].invoice_line_id,
                productId: result.rows[0].product_id,
                quantity: result.rows[0].quantity,
                price: result.rows[0].price,
                invoiceId: result.rows[0].invoice_id,
                createdAt: result.rows[0].created_at,
            };
        } finally {
            client.release();
        }
    }
}