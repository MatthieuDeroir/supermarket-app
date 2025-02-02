// modules/logs/bll/log.service.ts
import logRepository from "../dal/log.repository.ts";
import { Log } from "../log.model.ts";
import { DailyStock } from "../dto/dailyStock.dto.ts";

import {
    isSameDay,
    addDays
} from "https://esm.sh/date-fns@2.30.0";

// Si vous voulez un "startOfDay" en UTC pur
function startOfDay(d: Date): Date {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}



class LogService {
    async getAllLogs(): Promise<Log[]> {
        return logRepository.findAll();
    }


    async getLogById(logId: number): Promise<Log | null> {
        return logRepository.findById(logId);
    }

    async getLogsByProductId(productId:number): Promise<Log[]> {
        return logRepository.findByProductId(productId);
    }

    async getLogsByUserId(userId:number): Promise<Log[]> {
        return logRepository.findByUserId(userId);
    }

    async createLog(data: Omit<Log, "logId">): Promise<void> {
        await logRepository.create(data);
    }

    async updateLog(logId: number, data: Partial<Log>): Promise<void> {
        await logRepository.update(logId, data);
    }

    async deleteLog(logId: number): Promise<void> {
        await logRepository.deleteById(logId);
    }

    /**
     * Récupère l'état du stock warehouse / shelf pour chaque jour
     * dans l'intervalle [startDate, endDate].
     *
     * @param productId  identifiant du produit
     * @param startDate  date de début (inclus)
     * @param endDate    date de fin (inclus)
     */
    async getDailyStockHistory(productId: number, startDate: Date, endDate: Date): Promise<DailyStock[]> {
        // Dans votre méthode getDailyStockHistory ou dans le contrôleur
        if (endDate > new Date()) {
            endDate = new Date();
        }

        // 1) Récupère le dernier log avant startDate
        const lastBefore = await logRepository.findLastLogBefore(productId, startDate);

        // 2) Récupère les logs dans [startDate, endDate]
        const logsInRange = await logRepository.findLogsForProductBetween(productId, startDate, endDate);

        // 3) Concatène
        const allLogs: Log[] = [];
        if (lastBefore) {
            allLogs.push(lastBefore);
        }
        allLogs.push(...logsInRange);

        // Tri par date ASC
        allLogs.sort((a, b) => a.date.getTime() - b.date.getTime());

        // 4) Déterminer l'état initial (warehouse, shelf)
        //    => celui du lastBefore si on l'a
        let currentWarehouse = lastBefore?.stock_warehouse_after ?? 0;
        let currentShelf = lastBefore?.stock_shelf_bottom_after ?? 0;

        const results: DailyStock[] = [];

        // On normalise la date pour éviter les heures
        let dayCursor = startOfDay(startDate);
        const finalDay = startOfDay(endDate);

        // Tant que dayCursor <= finalDay
        while (dayCursor.getTime() <= finalDay.getTime()) {
            // logs du jour
            const dayLogs = allLogs.filter((l) => isSameDay(l.date, dayCursor));
            if (dayLogs.length > 0) {
                // on prend le dernier du jour => c'est l'état final
                const lastLogOfDay = dayLogs[dayLogs.length - 1];
                currentWarehouse = lastLogOfDay.stock_warehouse_after ?? currentWarehouse;
                currentShelf = lastLogOfDay.stock_shelf_bottom_after ?? currentShelf;
            }

            // on push le snapshot
            results.push({
                date: new Date(dayCursor),
                stockWarehouse: currentWarehouse,
                stockShelfBottom: currentShelf,
            });

            // passer au jour suivant
            dayCursor = addDays(dayCursor, 1);
        }

        return results;
    }
}

export const logService = new LogService();
export default logService;
