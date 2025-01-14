// modules/logs/bll/log.service.ts
import { LogRepository } from "../dal/log.repository.ts";
import { Log } from "../log.model.ts";
import { LogCreateDto } from "../dto/log-create.dto.ts";

export class LogService {
    constructor(private logRepo: LogRepository) {}

    async createLog(dto: LogCreateDto): Promise<Log> {
        const log: Log = {
            stockLogId: 0,
            date: new Date(),
            ...dto
        };
        return await this.logRepo.createLog(log);
    }

    async getProductLogs(productId: string): Promise<Log[]> {
        return await this.logRepo.findByProductId(productId);
    }
}