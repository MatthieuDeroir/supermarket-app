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

logController.get("product/:productId", async (c) => {
    const productId = Number(c.req.param("productId"));

    try {
        const logs = await logService.getLogsByProductId(productId);
        return c.json(logs);
    } catch(err) {
        return c.json({ message: err }, 400);
    }
})

logController.get("user/:userId", async (c) => {
    const userId = Number(c.req.param("userId"));

    try {
        const logs = await logService.getLogsByUserId(userId);
        return c.json(logs);
    } catch(err) {
        return c.json({ message: err }, 400);
    }
})

// GET /log/product/:productId/daily?start=YYYY-MM-DD&end=YYYY-MM-DD
logController.get("/product/:productId/daily", async (c) => {
    const productId = Number(c.req.param("productId"));
    const start = c.req.query("start");
    const end = c.req.query("end");
    if (!start || !end) {
        return c.json({ message: "Missing start / end query param" }, 400);
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return c.json({ message: "Invalid date format" }, 400);
    }

    try {
        const history = await logService.getDailyStockHistory(productId, startDate, endDate);
        return c.json(history);
    } catch (err) {
        return c.json({ message: err }, 400);
    }
});

export default logController;
