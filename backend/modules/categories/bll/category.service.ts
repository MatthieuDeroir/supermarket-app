// modules/categories/bll/category.service.ts
import { Category } from "../category.model.ts";
import categoryRepository from "../dal/category.repository.ts";

class CategoryService {
    async getAllCategories(): Promise<Category[]> {
        return categoryRepository.findAll();
    }

    async getCategoryById(categoryId: number): Promise<Category | null> {
        return categoryRepository.findById(categoryId);
    }

    async createCategory(data: Omit<Category, "categoryId">): Promise<void> {
        await categoryRepository.create(data);
    }

    async updateCategory(categoryId: number, data: Partial<Category>): Promise<void> {
        await categoryRepository.update(categoryId, data);
    }

    async deleteCategory(categoryId: number): Promise<void> {
        await categoryRepository.deleteById(categoryId);
    }
}

export const categoryService = new CategoryService();
export default categoryService;
