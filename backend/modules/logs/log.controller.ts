// modules/logs/log.controller.ts
import { Hono } from "hono";
import { logService } from "./bll/log.service.ts";

const logController = new Hono();

// GET /log
logController.get("/", async (c) => {
    const logs = await logService.getAllLogs();
    return c.json(logs);
});

// GET /log/:logId
logController.get("/:logId", async (c) => {
    const logId = Number(c.req.param("logId"));
    const log = await logService.getLogById(logId);
    if (!log) {
        return c.json({ message: "Log not found" }, 404);
    }
    return c.json(log);
});

// POST /log
logController.post("/", async (c) => {
    const body = await c.req.json();
    await logService.createLog(body);
    return c.json({ message: "Log created" }, 201);
});

// PUT /log/:logId
logController.put("/:logId", async (c) => {
    const logId = Number(c.req.param("logId"));
    const body = await c.req.json();
    await logService.updateLog(logId, body);
    return c.json({ message: "Log updated" });
});

// DELETE /log/:logId
logController.delete("/:logId", async (c) => {
    const logId = Number(c.req.param("logId"));
    await logService.deleteLog(logId);
    return c.json({ message: "Log deleted" });
});

export default logController;
