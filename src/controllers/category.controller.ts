import { RequestHandler } from "express";
import { categoryNameSchema, listCategoriesQuerySchema } from "../validators/category.validator";
import * as categoryService from "../services/category.service";
import { PublicCategory } from "../types/categories/public-category.type";
import { Category } from "../db/schema";
import { CategoryWithProductCount } from "../types/categories/category-with-product-count.type";

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