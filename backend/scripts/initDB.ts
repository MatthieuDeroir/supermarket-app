// scripts/initDB.ts
import db from "../config/database.ts";
import 'https://deno.land/std@0.223.0/dotenv/load.ts';
import { join } from "https://deno.land/std@0.203.0/path/mod.ts"; // pour manipuler les chemins

/**
 * Exécute les migrations SQL dans l'ordre de tri des noms de fichiers
 * (ex.: 001-create-roles.sql, 002-create-category.sql, etc.)
 */
async function runMigrations() {
    // Connecte la base si pas déjà fait
    await db.connect();

    const client = db.getClient();
    const migrationsPath = join(Deno.cwd(), "scripts", "migrations"); // chemin absolu

    // Liste tous les fichiers du dossier migrations
    const entries = [];
    for await (const dirEntry of Deno.readDir(migrationsPath)) {
        if (dirEntry.isFile && dirEntry.name.endsWith(".sql")) {
            entries.push(dirEntry.name);
        }
    }

    // Trie par ordre alphabétique pour respecter 001, 002, ...
    entries.sort();

    for (const fileName of entries) {
        const filePath = join(migrationsPath, fileName);
        // Lit le contenu du fichier .sql
        const sql = await Deno.readTextFile(filePath);

        console.log(`\n===> Executing: ${fileName}`);
        await client.queryArray(sql);
    }

    console.log("\nAll migrations executed successfully.");
    await db.close();
}

// Lancement direct "deno run scripts/initDB.ts"
if (import.meta.main) {
    await runMigrations();
}
