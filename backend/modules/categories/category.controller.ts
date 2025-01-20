// modules/tax/tax.controller.ts
import { Context } from "../../deps.ts";
import { TaxCategoryRepository } from "./dal/tax.repository.ts";
import { TaxCategoryService } from "./bll/tax.service.ts";
import { TaxCategoryCreateDto } from "./dto/tax-create.dto.ts";

const repo = new TaxCategoryRepository();
const service = new TaxCategoryService(repo);

export async function createTaxCategoryHandler(c: Context) {
    try {
        const body = await c.req.json();
        const dto = body as TaxCategoryCreateDto;
        const taxCategory = await service.createTaxCategory(dto);
        return c.json(taxCategory, 201);
    } catch (err) {
        if (err instanceof Error) {
            return c.text(err.message, 400);
        }
        return c.text("Unknown error", 500);
    }
}

export async function getAllTaxCategoriesHandler(c: Context) {
    const categories = await service.getAllTaxCategories();
    return c.json(categories);
}