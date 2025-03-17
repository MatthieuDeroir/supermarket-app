// modules/logs/bll/log.service.ts
import logRepository from "../dal/log.repository.ts";
import { Log } from "../log.model.ts";
import { DailyStock } from "../dto/dailyStock.dto.ts";
import { LogResponseDto, LogCreateDto } from "../dto/log.dto.ts";
import userRepository from "../../users/dal/user.repository.ts";
import productRepository from "../../products/dal/product.repository.ts";
import { ActionTypeEnum } from "../../../enums/actionTypeEnum.ts";
import { StockTypeEnum } from "../../../enums/stockTypeEnum.ts";
import { UserResponseDto } from "../../users/index.ts";
import { ProductResponseDto } from "../../products/dto/product.dto.ts";

// === Date utility functions ===
function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate()
    );
}

function addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function startOfDay(d: Date): Date {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function formatDate(date: Date, formatStr: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return formatStr.replace("YYYY", String(year))
        .replace("MM", month)
        .replace("DD", day);
}

class LogService {
    /**
     * Get all logs
     */
    async getAllLogs(): Promise<LogResponseDto[]> {
        const logs = await logRepository.findAll();
        const result: LogResponseDto[] = [];

        for (const log of logs) {
            result.push(await this.mapToResponseDto(log));
        }

        return result;
    }

    /**
     * Get a specific log by ID
     */
    async getLogById(logId: number): Promise<LogResponseDto | null> {
        const log = await logRepository.findById(logId);
        if (!log) return null;

        return await this.mapToResponseDto(log);
    }

    /**
     * Get logs for a specific product
     */
    async getLogsByProductId(productId: number): Promise<LogResponseDto[]> {
        const logs = await logRepository.findByProductId(productId);
        const result: LogResponseDto[] = [];

        for (const log of logs) {
            result.push(await this.mapToResponseDto(log));
        }

        return result;
    }

    /**
     * Get logs for a specific user
     */
    async getLogsByUserId(userId: number): Promise<LogResponseDto[]> {
        const logs = await logRepository.findByUserId(userId);
        const result: LogResponseDto[] = [];

        for (const log of logs) {
            result.push(await this.mapToResponseDto(log));
        }

        return result;
    }

    /**
     * Create a new log entry
     */
    async createLog(data: LogCreateDto): Promise<LogResponseDto> {
        console.log("Creating log entry:", data);
        // Convert DTO to DB model
        const logData: Omit<Log, "log_id"> = {
            date: data.date,
            user_id: data.userId,
            product_id: data.productId.toString(), // Convert to string as expected by DB
            quantity: data.quantity,
            reason: data.reason,
            action: data.action,
            stockType: data.stockType,
            stock_warehouse_after: data.stockWarehouseAfter,
            stock_shelf_bottom_after: data.stockShelfBottomAfter
        };

        await logRepository.create(logData);

        // Get the created log (not ideal, but works for now)
        const allLogs = await logRepository.findAll();
        const newLog = allLogs[allLogs.length - 1];

        return await this.mapToResponseDto(newLog);
    }

    /**
     * Delete a log entry (should be restricted)
     */
    async deleteLog(logId: number): Promise<void> {
        await logRepository.deleteById(logId);
    }

    /**
     * Get daily stock history for a product
     */
    async getDailyStockHistory(productId: number, startDate: Date, endDate: Date): Promise<DailyStock[]> {
        // Limit endDate to current date
        if (endDate > new Date()) {
            endDate = new Date();
        }

        // Get the last log before startDate
        const lastBefore = await logRepository.findLastLogBefore(productId, startDate);

        // Get all logs in the date range
        const logsInRange = await logRepository.findLogsForProductBetween(productId, startDate, endDate);

        // Combine logs
        const allLogs: Log[] = [];
        if (lastBefore) {
            allLogs.push(lastBefore);
        }
        allLogs.push(...logsInRange);

        // Sort logs by date
        allLogs.sort((a, b) => a.date.getTime() - b.date.getTime());

        // Initialize stock values
        let currentWarehouse = lastBefore?.stock_warehouse_after ?? 0;
        let currentShelf = lastBefore?.stock_shelf_bottom_after ?? 0;

        // Prepare result
        const results: DailyStock[] = [];

        // Process each day in the range
        let dayCursor = startOfDay(startDate);
        const finalDay = startOfDay(endDate);

        while (dayCursor.getTime() <= finalDay.getTime()) {
            // Get logs for the current day
            const dayLogs = allLogs.filter((l) => isSameDay(l.date, dayCursor));

            if (dayLogs.length > 0) {
                // Get the last log of the day to determine final state
                const lastLogOfDay = dayLogs[dayLogs.length - 1];
                currentWarehouse = lastLogOfDay.stock_warehouse_after ?? currentWarehouse;
                currentShelf = lastLogOfDay.stock_shelf_bottom_after ?? currentShelf;
            }

            // Add to results
            results.push({
                date: new Date(dayCursor),
                stockWarehouse: currentWarehouse,
                stockShelfBottom: currentShelf,
            });

            // Move to next day
            dayCursor = addDays(dayCursor, 1);
        }

        return results;
    }

    /**
     * Get logs by type and action
     */
    async getLogsByTypeAndAction(stockType: StockTypeEnum, action: ActionTypeEnum): Promise<LogResponseDto[]> {
        const client = (await import("../../../config/database.ts")).default.getClient();

        const query = `
            SELECT * FROM logs
            WHERE "stockType" = $1 AND action = $2
            ORDER BY date DESC
        `;

        const result = await client.queryObject<Log>({
            text: query,
            args: [stockType, action]
        });

        const logs: LogResponseDto[] = [];
        for (const log of result.rows) {
            logs.push(await this.mapToResponseDto(log));
        }

        return logs;
    }

    /**
     * Get logs within a date range
     */
    async getLogsByDateRange(startDate: Date, endDate: Date): Promise<LogResponseDto[]> {
        const client = (await import("../../../config/database.ts")).default.getClient();

        const query = `
            SELECT * FROM logs
            WHERE "date" >= $1 AND "date" <= $2
            ORDER BY date DESC
        `;

        const result = await client.queryObject<Log>({
            text: query,
            args: [startDate, endDate]
        });

        const logs: LogResponseDto[] = [];
        for (const log of result.rows) {
            logs.push(await this.mapToResponseDto(log));
        }

        return logs;
    }

    /**
     * Get recent activity logs (for dashboard, etc.)
     */
    async getRecentLogs(limit: number = 20): Promise<LogResponseDto[]> {
        const client = (await import("../../../config/database.ts")).default.getClient();

        const query = `
            SELECT * FROM logs
            ORDER BY date DESC
                LIMIT $1
        `;

        const result = await client.queryObject<Log>({
            text: query,
            args: [limit]
        });

        const logs: LogResponseDto[] = [];
        for (const log of result.rows) {
            logs.push(await this.mapToResponseDto(log));
        }

        return logs;
    }

    /**
     * Helper method to map DB model to response DTO
     */
    private async mapToResponseDto(log: Log): Promise<LogResponseDto> {
        // Get user and product details
        const user = await userRepository.findById(log.user_id);
        let product = undefined;

        if (log.product_id && log.product_id !== '0') {
            const productId = typeof log.product_id === 'string'
                ? parseInt(log.product_id)
                : log.product_id;

            if (!isNaN(<number>productId)) {
                product = await productRepository.findById(productId);
            }
        }

        // Create user and product DTOs if they exist
        let userDto: UserResponseDto | undefined = undefined;
        if (user) {
            userDto = {
                id: user.user_id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phoneNumber: user.phone_number,
                roleId: user.role_id
            };
        }

        let productDto: ProductResponseDto | undefined = undefined;
        if (product) {
            productDto = {
                id: product.product_id,
                ean: product.ean,
                name: product.name,
                brand: product.brand,
                description: product.description,
                picture: product.picture,
                nutritionalInformation: product.nutritional_information,
                price: product.price,
                stockWarehouse: product.stock_warehouse ?? 0,
                stockShelfBottom: product.stock_shelf_bottom ?? 0,
                minimumStock: product.minimum_stock,
                minimumShelfStock: product.minimum_shelf_stock,
                categoryId: product.category_id
            };
        }

        // Make sure to explicitly cast the fields that need to be numbers
        return {
            id: Number(log.log_id), // Explicit conversion to number
            date: log.date,
            userId: Number(log.user_id), // Explicit conversion to number
            productId: parseInt(log.product_id?.toString() || '0'),
            quantity: log.quantity,
            reason: log.reason || '',
            action: log.action,
            stockType: log.stockType,
            stockWarehouseAfter: log.stock_warehouse_after ?? 0,
            stockShelfBottomAfter: log.stock_shelf_bottom_after ?? 0,
            user: userDto, // Now undefined instead of null
            product: productDto // Now undefined instead of null
        };
    }
}

export const logService = new LogService();
export default logService;