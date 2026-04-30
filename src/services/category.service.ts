import { PublicCategory } from "../types/categories/public-category.type";
import * as categoryRepository from "../repositories/category.repository";
import { Category, NewCategory } from "../db/schema";
import { formatCategory } from "../helpers/categories.helper";
import { CategoryWithProductCount } from "../types/categories/category-with-product-count.type";
import { AppError } from "../errors/app.error";

export const createCategory = async (categoryData: NewCategory): Promise<PublicCategory> => {
    const createdCategory: Category = await categoryRepository.createCategory(categoryData);
    return formatCategory(createdCategory);
};

export const listPublicCategories = async (includeProductCount: boolean): Promise<CategoryWithProductCount[]> => {
    return await categoryRepository.listPublicCategories(includeProductCount);
}

export const getCategoryById = async (categoryId: string): Promise<PublicCategory> => {
    const category: Category | null = await categoryRepository.getCategoryById(categoryId);

    if (!category) {
        throw new AppError(404, 'Categoria não encontrada');
    }

    return formatCategory(category);
}