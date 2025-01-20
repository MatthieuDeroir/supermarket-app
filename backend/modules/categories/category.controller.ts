// modules/categories/category.controller.ts
import { Hono } from "hono";
import { categoryService } from "./bll/category.service.ts";

const categoryController = new Hono();

// GET /category
categoryController.get("/", async (c) => {
    const categories = await categoryService.getAllCategories();
    return c.json(categories);
});

// GET /category/:categoryId
categoryController.get("/:categoryId", async (c) => {
    const categoryId = Number(c.req.param("categoryId"));
    const category = await categoryService.getCategoryById(categoryId);
    if (!category) {
        return c.json({ message: "Category not found" }, 404);
    }
    return c.json(category);
});

// POST /category
categoryController.post("/", async (c) => {
    const body = await c.req.json();
    await categoryService.createCategory(body);
    return c.json({ message: "Category created" }, 201);
});

// PUT /category/:categoryId
categoryController.put("/:categoryId", async (c) => {
    const categoryId = Number(c.req.param("categoryId"));
    const body = await c.req.json();
    await categoryService.updateCategory(categoryId, body);
    return c.json({ message: "Category updated" });
});

// DELETE /category/:categoryId
categoryController.delete("/:categoryId", async (c) => {
    const categoryId = Number(c.req.param("categoryId"));
    await categoryService.deleteCategory(categoryId);
    return c.json({ message: "Category deleted" });
});

export default categoryController;
