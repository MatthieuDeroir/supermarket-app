import { GenericRepository } from "../../generic.repository.ts";
import { InvoiceLine } from "../invoiceline.model.ts";

export class InvoiceLineRepository extends GenericRepository<InvoiceLine> {
    constructor() {
        super({
            tableName: "invoice_lines",
            primaryKey: "invoice_line_id",
        });
    }

    /**
     * Récupère toutes les lignes associées à une invoice
     */
    async findByInvoiceId(invoice_id: number): Promise<InvoiceLine[]> {
        const client = (await import("../../../config/database.ts")).default.getClient();
        const query = `SELECT * FROM invoice_lines WHERE invoice_id = $1`;
        const result = await client.queryObject<InvoiceLine>({
            text: query,
            args: [invoice_id],
        });
        return result.rows;
    }
}

const invoiceLineRepository = new InvoiceLineRepository();
export default invoiceLineRepository;
