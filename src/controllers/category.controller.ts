import { RequestHandler } from "express";
import { categoryIdSchema, categoryNameSchema, listCategoriesQuerySchema } from "../validators/category.validator";
import * as categoryService from "../services/category.service";
import { PublicCategory } from "../types/categories/public-category.type";
import { CategoryWithProductCount } from "../types/categories/category-with-product-count.type";
import { AppError } from "../errors/app.error";

export const createCategory: RequestHandler = async (req, res): Promise<void> => {
    const createCategoryData = categoryNameSchema.parse(req.body);
    const createdCategory: PublicCategory = await categoryService.createCategory(createCategoryData);
    res.status(201).json({ error: null, data: createdCategory });
};

export const listPublicCategories: RequestHandler = async (req, res): Promise<void> => {
    const { includeProductCount } = listCategoriesQuerySchema.parse(req.query);
    const categoriesList: CategoryWithProductCount[] = await categoryService.listPublicCategories(includeProductCount);
    res.status(200).json({ error: null, data: categoriesList });
};

export const getCategoryById: RequestHandler = async (req, res): Promise<void> => {
    const { id } = categoryIdSchema.parse(req.params);
    const category: PublicCategory | null = await categoryService.getCategoryById(id);

    if (!category) {
        throw new AppError(404, 'Categoria não encontrada');
    }

    res.status(200).json({ error: null, data: category });
};

export const updateCategoryById: RequestHandler = async (req, res): Promise<void> => {
    const { id } = categoryIdSchema.parse(req.params);
    const updateCategoryData = categoryNameSchema.parse(req.body);
    const updatedCategory: PublicCategory | null = await categoryService.updateCategoryById(id, updateCategoryData);

    if (!updatedCategory) {
        throw new AppError(404, 'Categoria não encontrada');
    }

    res.status(200).json({ error: null, data: updatedCategory });
};

export const deleteCategoryById: RequestHandler = async (req, res): Promise<void> => {
    const { id } = categoryIdSchema.parse(req.params);
    await categoryService.deleteCategoryById(id);
    res.status(204).json({ error: null, data: null });
}