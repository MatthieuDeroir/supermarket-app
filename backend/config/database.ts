// src/core/database.ts
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

/**
 * Gère la connexion à la base de données PostgreSQL.
 */
export class Database {
    private client: Client;

    constructor() {
        this.client = new Client({
            user: "postgres",
            database: "t_dev_700_dev",
            hostname: "127.0.0.1",
            password: "postgres",
            port: 5432
        });
    }

    async connect(): Promise<void> {
        await this.client.connect();
    }

    getClient(): Client {
        return this.client;
    }

    async close(): Promise<void> {
        await this.client.end();
    }
}

// Instance partagée dans l'application
const db = new Database();
export default db;
