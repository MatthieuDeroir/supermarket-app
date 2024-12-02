import { Hono } from "hono";

const app = new Hono();

app.get("/v1", (c) => c.text("Hello Deno!"));

Deno.serve({ port: 4000 }, app.fetch);

app.get("/health", (c) => c.json({ status: "ok" }));
