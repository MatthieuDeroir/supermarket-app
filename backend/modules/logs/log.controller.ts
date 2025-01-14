// modules/logs/log.controller.ts
import { Context } from "../../deps.ts";
import { LogRepository } from "./dal/log.repository.ts";
import { LogService } from "./bll/log.service.ts";
import { LogCreateDto } from "./dto/log-create.dto.ts";

const repo = new LogRepository();
const service = new LogService(repo);

export async function createLogHandler(c: Context) {
    try {
        const body = await c.req.json();
        const dto = body as LogCreateDto;
        const log = await service.createLog(dto);
        return c.json(log, 201);
    } catch (err) {
        if (err instanceof Error) {
            return c.text(err.message, 400);
        }
        return c.text("Unknown error", 500);
    }
}

export async function getProductLogsHandler(c: Context) {
    const productId = c.req.param("productId");
    const logs = await service.getProductLogs(productId);
    return c.json(logs);
}