// modules/carts/dal/cart.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { Cart } from "../cart.model.ts";

export class CartRepository extends GenericRepository<Cart> {
    constructor() {
        super({
            tableName: "carts",    // Nom de la table dans votre DB
            primaryKey: "cartId",  // PK
        });
    }

    // ... Méthodes spécifiques si besoin
}

const cartRepository = new CartRepository();
export default cartRepository;
