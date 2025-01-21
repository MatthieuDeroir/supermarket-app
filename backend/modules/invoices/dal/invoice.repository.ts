// modules/invoices/dal/invoice.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { Invoice } from "../invoice.model.ts";

export class InvoiceRepository extends GenericRepository<Invoice> {
    constructor() {
        super({
            tableName: "invoices",
            primaryKey: "invoiceId",
        });
    }
}

const invoiceRepository = new InvoiceRepository();
export default invoiceRepository;
