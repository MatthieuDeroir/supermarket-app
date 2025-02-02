// modules/logs/bll/log.service.ts
import logRepository from "../dal/log.repository.ts";
import { Log } from "../log.model.ts";
import { DailyStock } from "../dto/dailyStock.dto.ts";

// === REMPLACEMENT DE DATE-FNS PAR DES FONCTIONS NATIVES ===

// Vérifie si deux dates représentent le même jour en UTC.
function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate()
    );
}

// Ajoute un nombre de jours à une date.
function addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

// Retourne le début de la journée (00:00:00 UTC) pour une date donnée.
function startOfDay(d: Date): Date {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

// (Optionnel) Si vous avez besoin d'une fonction simple pour formater une date,
// vous pouvez implémenter une version très basique. Par exemple :
function formatDate(date: Date, formatStr: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    // Exemple de remplacement : "YYYY-MM-DD"
    return formatStr.replace("YYYY", String(year))
        .replace("MM", month)
        .replace("DD", day);
}

class LogService {
    async getAllLogs(): Promise<Log[]> {
        return logRepository.findAll();
    }

    async getLogById(logId: number): Promise<Log | null> {
        return logRepository.findById(logId);
    }

    async getLogsByProductId(productId: number): Promise<Log[]> {
        return logRepository.findByProductId(productId);
    }

    async getLogsByUserId(userId: number): Promise<Log[]> {
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
        // Si endDate est dans le futur, on le remplace par la date actuelle.
        if (endDate > new Date()) {
            endDate = new Date();
        }

        // 1) Récupérer le dernier log avant startDate
        const lastBefore = await logRepository.findLastLogBefore(productId, startDate);

        // 2) Récupérer les logs dans [startDate, endDate]
        const logsInRange = await logRepository.findLogsForProductBetween(productId, startDate, endDate);

        // 3) Concaténer les logs (le dernier avant et ceux dans l'intervalle)
        const allLogs: Log[] = [];
        if (lastBefore) {
            allLogs.push(lastBefore);
        }
        allLogs.push(...logsInRange);

        // Trier les logs par date ASC
        allLogs.sort((a, b) => a.date.getTime() - b.date.getTime());

        // 4) Déterminer l'état initial (warehouse, shelf)
        let currentWarehouse = lastBefore?.stock_warehouse_after ?? 0;
        let currentShelf = lastBefore?.stock_shelf_bottom_after ?? 0;

        const results: DailyStock[] = [];

        // Normaliser la date pour éviter les heures
        let dayCursor = startOfDay(startDate);
        const finalDay = startOfDay(endDate);

        // Tant que dayCursor <= finalDay
        while (dayCursor.getTime() <= finalDay.getTime()) {
            // Récupérer les logs du jour
            const dayLogs = allLogs.filter((l) => isSameDay(l.date, dayCursor));
            if (dayLogs.length > 0) {
                // Le dernier log du jour définit l'état final
                const lastLogOfDay = dayLogs[dayLogs.length - 1];
                currentWarehouse = lastLogOfDay.stock_warehouse_after ?? currentWarehouse;
                currentShelf = lastLogOfDay.stock_shelf_bottom_after ?? currentShelf;
            }

            // Ajouter l'état du jour dans les résultats
            results.push({
                date: new Date(dayCursor),
                stockWarehouse: currentWarehouse,
                stockShelfBottom: currentShelf,
            });

            // Passer au jour suivant
            dayCursor = addDays(dayCursor, 1);
        }

        return results;
    }
}

export const logService = new LogService();
export default logService;
