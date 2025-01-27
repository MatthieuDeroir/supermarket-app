// src/core/genericRepository.ts
import db from "../config/database.ts";

export interface GenericRepositoryOptions<T> {
    tableName: string;
    primaryKey: keyof T; // la clé primaire est une clé de l'interface T
}

export class GenericRepository<T extends Record<string, unknown>> {
    protected tableName: string;
    private primaryKey: keyof T;

    constructor(options: GenericRepositoryOptions<T>) {
        this.tableName = options.tableName;
        this.primaryKey = options.primaryKey;
    }

    /**
     * Crée un nouvel enregistrement dans la table.
     * @param data Données à insérer
     */
    async create(data: Partial<T>): Promise<void> {
        const columns = Object.keys(data);
        const values = Object.values(data);

        const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
        const query = `
            INSERT INTO ${this.tableName} (${columns.join(", ")})
            VALUES (${placeholders})
        `;

        const client = db.getClient();
        await client.queryArray({
            text: query,
            args: values,
        });
    }

    /**
     * Retourne l'ensemble des enregistrements.
     */
    async findAll(): Promise<T[]> {
        const client = db.getClient();
        const result = await client.queryObject<T>(
            `SELECT * FROM ${this.tableName}`
        );
        return result.rows;
    }

    /**
     * Retourne un enregistrement unique par sa PK.
     * @param pk Valeur de la PK (ex: userId)
     */
    async findById(pk: T[keyof T]): Promise<T | null> {
        const client = db.getClient();
        const query = `
      SELECT *
      FROM ${this.tableName}
      WHERE ${String(this.primaryKey)} = $1
    `;
        const result = await client.queryObject<T>({
            text: query,
            args: [pk],
        });
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Met à jour un enregistrement par sa PK.
     * @param pk Valeur de la PK
     * @param data Données à mettre à jour
     */
    async update(pk: T[keyof T], data: Partial<T>): Promise<void> {
        const columns = Object.keys(data);
        const values = Object.values(data);

        // Génère "SET col = $1, col2 = $2" etc.
        const setClause = columns
            .map((col, index) => `${col} = $${index + 1}`)
            .join(", ");

        const query = `
            UPDATE ${this.tableName}
            SET ${setClause}
            WHERE ${String(this.primaryKey)} = $${columns.length + 1}
    `;

        const client = db.getClient();
        await client.queryArray({
            text: query,
            args: [...values, pk],
        });
    }

    /**
     * Supprime un enregistrement par sa PK.
     * @param pk Valeur de la PK
     */
    async deleteById(pk: T[keyof T]): Promise<void> {
        const client = db.getClient();
        const query = `
      DELETE
      FROM ${this.tableName}
      WHERE ${String(this.primaryKey)} = $1
    `;
        await client.queryArray({
            text: query,
            args: [pk],
        });
    }
}
