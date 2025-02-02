import { GenericRepository } from "../../generic.repository.ts";
import { Category } from "../category.model.ts";

export class CategoryRepository extends GenericRepository<Category> {
    constructor() {
        super({
            tableName: "categories",
            primaryKey: "category_id",
        });
    }
}

const categoryRepository = new CategoryRepository();
export default categoryRepository;
