import { Hono } from "hono";
import db from "./config/database.ts"; // Fichier de connexion
import routes from "./modules/routes.ts";


const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

// Connexion DB
await db.connect();

// Monte toutes les routes
app.route("/", routes);

Deno.serve({ port: 4000 }, app.fetch);
