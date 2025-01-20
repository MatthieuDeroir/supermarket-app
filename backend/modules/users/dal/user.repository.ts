// modules/users/dal/user.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { User } from "../user.model.ts";

export class UserRepository extends GenericRepository<User> {
    constructor() {
        super({
            tableName: "Users",
            primaryKey: "userId",
        });
    }

    // Méthodes spécifiques à "Users" si besoin
    // ex.: findByEmail(), etc.
}

const userRepository = new UserRepository();
export default userRepository;
