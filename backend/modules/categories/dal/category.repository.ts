import { GenericRepository } from "../../generic.repository.ts";
import { Category } from "../category.model.ts";

export class CategoryRepository extends GenericRepository<Category> {
    constructor() {
        super({
            tableName: "categories",
            primaryKey: "categoryId",
        });
    }
}

const categoryRepository = new CategoryRepository();
export default categoryRepository;
