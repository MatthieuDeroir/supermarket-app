// config/database.ts
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// Création d'un pool de connexions PostgreSQL
const POOL_CONNECTIONS = 3;
const dbPool = new Pool({
    hostname: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "postgres",  // à adapter
    database: "t_dev_700_dev", // à adapter
}, POOL_CONNECTIONS);

export async function getDBClient() {
    return await dbPool.connect();
}
