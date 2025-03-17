// modules/users/dal/user.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { User } from "../user.model.ts";
import db from "../../../config/database.ts";


export class UserRepository extends GenericRepository<User> {
    constructor() {
        super({
            tableName: "users",
            primaryKey: "user_id",
        });
    }
    /**
     * Insère un utilisateur et retourne son user_id.
     */
    async createReturningId(data: Partial<User>): Promise<number> {
        // Récupère l'instance de la connexion DB
        const client = db.getClient();

        // Transforme l'objet data en colonnes/valeurs
        const columns = Object.keys(data);   // e.g. ["email", "password", "first_name", ...]
        const values = Object.values(data);

        // Construit la liste des placeholders : $1, $2, ...
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");

        // Construit la requête SQL
        const query = `
      INSERT INTO ${this.tableName} (${columns.join(", ")})
      VALUES (${placeholders})
      RETURNING ${this.primaryKey}
    `;

        // Exécute la requête
        const result = await client.queryObject<{ user_id: number }>({
            text: query,
            args: values,
        });

        // Retourne l'ID inséré (par exemple user_id)
        return result.rows[0].user_id;
    }

    // Example: find by email
    async findByEmail(email: string): Promise<User | null> {
        const client = db.getClient(); // from your base repository or however you manage DB
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await client.queryObject<User>({
            text: query,
            args: [email],
        });
        return result.rows.length > 0 ? result.rows[0] : null;
    }
}

const userRepository = new UserRepository();
export default userRepository;
