// src/core/database.ts
import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
import 'https://deno.land/std@0.223.0/dotenv/load.ts';
import getEnv from '../utils/getEnv.ts';

/**
 * Gère la connexion à la base de données PostgreSQL.
 */
export class Database {
  private client: Client;

  constructor() {
    this.client = new Client({
      user: getEnv('DB_USER'),
      database: getEnv('DB_NAME'),
      hostname: getEnv('DB_URL'),
      password: getEnv('DB_PASSWORD'),
      port: getEnv('DB_PORT'),
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
