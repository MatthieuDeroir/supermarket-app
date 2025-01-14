// modules/tax/bll/tax.service.ts
import { TaxCategoryRepository } from "../dal/tax.repository.ts";
import { TaxCategory } from "../tax.model.ts";
import { TaxCategoryCreateDto } from "../dto/tax-create.dto.ts";

export class TaxCategoryService {
    constructor(private taxCategoryRepo: TaxCategoryRepository) {}

    async createTaxCategory(dto: TaxCategoryCreateDto): Promise<TaxCategory> {
        return await this.taxCategoryRepo.create(dto);
    }

    async getAllTaxCategories(): Promise<TaxCategory[]> {
        return await this.taxCategoryRepo.findAll();
    }
}