import { GenericRepository } from "../../generic.repository.ts";
import { Invoice } from "../invoice.model.ts";

export class InvoiceRepository extends GenericRepository<Invoice> {
    constructor() {
        super({
            tableName: "invoices",
            primaryKey: "invoice_id",
        });
    }

    async findByUserId(userId: number): Promise<Invoice[]> {
        const client = (await import("../../../config/database.ts")).default.getClient();
        const query = `SELECT * FROM invoices WHERE user_id = $1`;
        const result = await client.queryObject<Invoice>({
            text: query,
            args: [userId],
        });
        return result.rows;
    }
}

const invoiceRepository = new InvoiceRepository();
export default invoiceRepository;
