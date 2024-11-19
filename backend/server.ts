import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("Hello Deno!"));

Deno.serve({ port: 4000 }, app.fetch);
