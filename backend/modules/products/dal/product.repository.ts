// modules/products/dal/product.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { Product } from "../product.model.ts";

export class ProductRepository extends GenericRepository<Product> {
    constructor() {
        super({
            tableName: "Products",   // Nom de la table
            primaryKey: "productId", // Nom de la PK (type number)
        });
    }
}

const productRepository = new ProductRepository();
export default productRepository;
