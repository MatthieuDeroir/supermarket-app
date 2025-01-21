// modules/carts/dal/cartline.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { CartLine } from "../cartline.model.ts";

export class CartLineRepository extends GenericRepository<CartLine> {
    constructor() {
        super({
            tableName: "cartLines",
            primaryKey: "carteLineId", // d’après votre schéma, c’est "carteLineId"
        });
    }

    /**
     * Exemple de méthode spécifique pour récupérer toutes les lignes
     * d’un cart donné.
     */
    async findByCartId(cartId: number): Promise<CartLine[]> {
        const client = (await import("../../../config/database.ts")).default.getClient();
        const query = `SELECT * FROM cartLines WHERE cartId = $1`;
        const result = await client.queryObject<CartLine>({
            text: query,
            args: [cartId],
        });
        return result.rows;
    }
}

const cartLineRepository = new CartLineRepository();
export default cartLineRepository;
