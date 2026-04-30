import { RequestHandler } from "express";
import { categoryNameSchema } from "../validators/category.validator";
import * as categoryService from "../services/category.service";
import { PublicCategory } from "../types/categories/public-category.type";

export const createCategory: RequestHandler = async (req, res): Promise<void> => {
    const createCategoryData = categoryNameSchema.parse(req.body);
    const createdCategory: PublicCategory = await categoryService.createCategory(createCategoryData);
    res.status(201).json({ error: null, data: createdCategory });
};