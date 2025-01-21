// modules/invoices/dal/invoiceline.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { InvoiceLine } from "../invoiceline.model.ts";

export class InvoiceLineRepository extends GenericRepository<InvoiceLine> {
    constructor() {
        super({
            tableName: "invoicelines",
            primaryKey: "invoiceLineId",
        });
    }

    async findByInvoiceId(invoiceId: number): Promise<InvoiceLine[]> {
        const client = (await import("../../../config/database.ts")).default.getClient();
        const query = `SELECT * FROM invoiceLines WHERE invoiceId = $1`;
        const result = await client.queryObject<InvoiceLine>({
            text: query,
            args: [invoiceId],
        });
        return result.rows;
    }
}

const invoiceLineRepository = new InvoiceLineRepository();
export default invoiceLineRepository;
