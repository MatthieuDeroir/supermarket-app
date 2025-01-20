// modules/logs/bll/log.service.ts
import logRepository from "../dal/log.repository.ts";
import { Log } from "../log.model.ts";

class LogService {
    async getAllLogs(): Promise<Log[]> {
        return logRepository.findAll();
    }

    async getLogById(logId: number): Promise<Log | null> {
        return logRepository.findById(logId);
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
}

export const logService = new LogService();
export default logService;
