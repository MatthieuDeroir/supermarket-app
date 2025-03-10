// modules/invoices/bll/invoice.service.ts
import db from "../../../config/database.ts";
import invoiceRepository from "../dal/invoice.repository.ts";
import invoiceLineRepository from "../dal/invoiceline.repository.ts";
import userRepository from "../../users/dal/user.repository.ts";
import addressRepository from "../../addresses/dal/address.repository.ts";
import productRepository from "../../products/dal/product.repository.ts";
import cartRepository from "../../carts/dal/cart.repository.ts";
import { Invoice } from "../invoice.model.ts";
import { InvoiceLine } from "../invoiceline.model.ts";
import { InvoiceResponseDto, InvoiceCreateDto } from "../dto/invoice.dto.ts";
import { InvoiceLineResponseDto } from "../dto/invoiceline.dto.ts";
import { ActionTypeEnum } from "../../../enums/actionTypeEnum.ts";
import { StockTypeEnum } from "../../../enums/stockTypeEnum.ts";
import logService from "../../logs/bll/log.service.ts";

class InvoiceService {
    /**
     * Get all invoices with their lines and related data
     */
    async getAllInvoices(): Promise<InvoiceResponseDto[]> {
        const invoices = await invoiceRepository.findAll();
        const result: InvoiceResponseDto[] = [];

        for (const invoice of invoices) {
            result.push(await this.getInvoiceDetails(invoice));
        }

        return result;
    }

    /**
     * Get a specific invoice by ID with all details
     */
    async getInvoiceById(invoiceId: number): Promise<InvoiceResponseDto | null> {
        const invoice = await invoiceRepository.findById(invoiceId);
        if (!invoice) return null;

        return await this.getInvoiceDetails(invoice);
    }

    /**
     * Get all invoices for a specific user
     */
    async getInvoicesByUserId(userId: number): Promise<InvoiceResponseDto[]> {
        const invoices = await invoiceRepository.findByUserId(userId);
        const result: InvoiceResponseDto[] = [];

        for (const invoice of invoices) {
            result.push(await this.getInvoiceDetails(invoice));
        }

        return result;
    }

    /**
     * Create a new invoice (typically happens when a cart is paid)
     */
    async createInvoice(data: InvoiceCreateDto, userId: number): Promise<InvoiceResponseDto> {
        const client = db.getClient();

        try {
            await client.queryArray("BEGIN");

            // Check if cart exists and is unpaid
            const cart = await cartRepository.findById(data.cartId);
            if (!cart) {
                throw new Error(`Cart with ID ${data.cartId} not found`);
            }

            if (cart.payed) {
                throw new Error(`Cart with ID ${data.cartId} is already paid`);
            }

            // Check if address exists
            const address = await addressRepository.findById(data.addressId);
            if (!address) {
                throw new Error(`Address with ID ${data.addressId} not found`);
            }

            // Create the invoice
            const invoiceData = {
                user_id: data.userId,
                address_id: data.addressId,
                cart_id: data.cartId,
                created_at: new Date()
            };

            await invoiceRepository.create(invoiceData);

            // Mark the cart as paid
            await cartRepository.update(data.cartId, {
                payed: true,
                payed_at: new Date()
            });

            // Get the newly created invoice
            const invoices = await invoiceRepository.findAll();
            const newInvoice = invoices[invoices.length - 1];

            // Log the invoice creation
            await logService.createLog({
                date: new Date(),
                userId: userId,
                productId: 0, // No specific product
                quantity: 0,
                reason: `Invoice created for cart #${data.cartId}`,
                action: ActionTypeEnum.CREATE,
                stockType: StockTypeEnum.CART,
                stockWarehouseAfter: 0,
                stockShelfBottomAfter: 0
            });

            await client.queryArray("COMMIT");

            return await this.getInvoiceDetails(newInvoice);

        } catch (error) {
            await client.queryArray("ROLLBACK");
            throw error;
        }

    }

    async updateInvoice(invoiceId: number, data: InvoiceCreateDto, userId: number): Promise<InvoiceResponseDto> {
        const client = db.getClient();

        try {
            await client.queryArray("BEGIN");

            // Check if invoice exists
            const invoice = await invoiceRepository.findById(invoiceId);
            if (!invoice) {
                throw new Error(`Invoice with ID ${invoiceId} not found`);
            }

            // Check if cart exists and is unpaid
            const cart = await cartRepository.findById(data.cartId);

            if (!cart) {
                throw new Error(`Cart with ID ${data.cartId} not found`);
            }

            if (cart.payed) {
                throw new Error(`Cart with ID ${data.cartId} is already paid`);
            }

            // Check if address exists
            const address = await addressRepository.findById(data.addressId);

            if (!address) {
                throw new Error(`Address with ID ${data.addressId} not found`);
            }

            // Update the invoice
            const invoiceData = {
                user_id: data.userId,
                address_id: data.addressId,
                cart_id: data.cartId,
                created_at: new Date()
            };

            await invoiceRepository.update(invoiceId, invoiceData);

            // Mark the cart as paid

            await cartRepository.update(data.cartId, {
                payed: true,
                payed_at: new Date()
            });

            // Get the updated invoice
            const invoices = await invoiceRepository.findAll();
            const newInvoice = invoices[invoices.length - 1];

            // Log the invoice update
            await logService.createLog({
                date: new Date(),
                userId: userId,
                productId: 0, // No specific product
                quantity: 0,
                reason: `Invoice #${invoiceId} updated`,
                action: ActionTypeEnum.UPDATE,
                stockType: StockTypeEnum.CART,
                stockWarehouseAfter: 0,
                stockShelfBottomAfter: 0
            });

            await client.queryArray("COMMIT");

            return await this.getInvoiceDetails(newInvoice);

        } catch (error) {
            await client.queryArray("ROLLBACK");
            throw error;
        }
    }

    /**
     * Delete an invoice (should be restricted to admin users or specific cases)
     */
    async deleteInvoice(invoiceId: number, userId: number): Promise<void> {
        const client = db.getClient();

        try {
            await client.queryArray("BEGIN");

            const invoice = await invoiceRepository.findById(invoiceId);
            if (!invoice) {
                throw new Error(`Invoice with ID ${invoiceId} not found`);
            }

            // Delete all invoice lines first
            const lines = await invoiceLineRepository.findByInvoiceId(invoiceId);
            for (const line of lines) {
                await invoiceLineRepository.deleteById(line.invoice_line_id);
            }

            // Delete the invoice
            await invoiceRepository.deleteById(invoiceId);

            // Log the deletion
            await logService.createLog({
                date: new Date(),
                userId: userId,
                productId: 0, // No specific product
                quantity: 0,
                reason: `Invoice #${invoiceId} deleted`,
                action: ActionTypeEnum.DELETE,
                stockType: StockTypeEnum.CART,
                stockWarehouseAfter: 0,
                stockShelfBottomAfter: 0
            });

            await client.queryArray("COMMIT");

        } catch (error) {
            await client.queryArray("ROLLBACK");
            throw error;
        }
    }

    /**
     * Helper method to get complete invoice details
     */
    private async getInvoiceDetails(invoice: Invoice): Promise<InvoiceResponseDto> {
        // Get invoice lines
        const lines = await invoiceLineRepository.findByInvoiceId(invoice.invoice_id);

        // Get user and address
        const user = await userRepository.findById(invoice.user_id);
        const address = await addressRepository.findById(invoice.address_id);

        // Process invoice lines
        const lineResponses: InvoiceLineResponseDto[] = [];
        let total = 0;

        for (const line of lines) {
            const product = await productRepository.findById(line.product_id);

            // Add the line total to invoice total
            total += (line.price * line.quantity);

            // Create line DTO with product details if available
            lineResponses.push({
                id: line.invoice_line_id,
                productId: parseInt(line.product_id),
                quantity: line.quantity,
                price: line.price,
                invoiceId: line.invoice_id,
                createdAt: line.created_at,
                product: product ? {
                    id: product.product_id,
                    ean: product.ean,
                    name: product.name,
                    brand: product.brand,
                    description: product.description,
                    picture: product.picture,
                    nutritionalInformation: product.nutritional_information,
                    price: line.price, // Use invoice line price as it's the historical price
                    stockWarehouse: product.stock_warehouse ?? 0,
                    stockShelfBottom: product.stock_shelf_bottom ?? 0,
                    minimumStock: product.minimum_stock,
                    minimumShelfStock: product.minimum_shelf_stock,
                    categoryId: product.category_id
                } : undefined
            });
        }

        // Create and return the invoice response DTO
        return {
            id: invoice.invoice_id,
            userId: invoice.user_id,
            addressId: invoice.address_id,
            cartId: invoice.cart_id,
            createdAt: invoice.created_at,
            lines: lineResponses,
            total: parseFloat(total.toFixed(2)),
            user: user ? {
                id: user.user_id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phoneNumber: user.phone_number,
                roleId: user.role_id
            } : undefined,
            address: address ? {
                address_id: address.address_id,
                user_id: address.user_id ?? 0,
                address_line1: address.addressLine1 ?? '',
                address_line2: address.addressLine2,
                address_complement: address.addressComplement,
                zip_code: address.zipCode ?? '',
                city: address.city ?? '',
                country: address.country ?? '',
                active: address.active ?? true
            } : undefined
        };
    }
}

export const invoiceService = new InvoiceService();
export default invoiceService;