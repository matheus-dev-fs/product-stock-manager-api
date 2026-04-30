import { PublicCategory } from "../types/categories/public-category.type";
import * as categoryRepository from "../repositories/category.repository";
import { Category, NewCategory } from "../db/schema";
import { formatCategory } from "../helpers/categories.helper";

export const createCategory = async (categoryData: NewCategory): Promise<PublicCategory> => {
    const createdCategory: Category = await categoryRepository.createCategory(categoryData);
    return formatCategory(createdCategory);
};