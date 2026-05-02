import { PublicCategory } from "../types/categories/public-category.type";
import * as categoryRepository from "../repositories/category.repository";
import * as productService from "./product.service";
import { Category, NewCategory } from "../db/schema";
import { formatCategory } from "../helpers/categories.helper";
import { CategoryWithProductCount } from "../types/categories/category-with-product-count.type";
import { AppError } from "../errors/app.error";
import { PublicProduct } from "../types/products/public-product.type";

export const createCategory = async (categoryData: NewCategory, tx?: unknown): Promise<PublicCategory> => {
    const createdCategory: Category = await categoryRepository.createCategory(categoryData, tx);
    return formatCategory(createdCategory);
};

export const listPublicCategories = async (includeProductCount: boolean, tx?: unknown): Promise<CategoryWithProductCount[]> => {
    return await categoryRepository.listPublicCategories(includeProductCount, tx);
}

export const getCategoryById = async (categoryId: string, tx?: unknown): Promise<PublicCategory | null> => {
    const category: Category | null = await categoryRepository.getCategoryById(categoryId, tx);

    if (!category) {
        return null;
    }

    return formatCategory(category);
}

export const updateCategoryById = async (categoryId: string, categoryData: NewCategory, tx?: unknown): Promise<PublicCategory | null> => {
    const updatedCategoryData: NewCategory = {
        ...categoryData,
        updatedAt: new Date()
    }

    const updatedCategory: Category | null = await categoryRepository.updateCategoryById(categoryId, updatedCategoryData, tx);

    if (!updatedCategory) {
        return null;
    }

    return formatCategory(updatedCategory);
};

export const deleteCategoryById = async (categoryId: string, tx?: unknown): Promise<void> => {
    const existingProductInCategory: PublicProduct | null = await productService.getProductByCategoryId(categoryId, tx);

    if (existingProductInCategory) {
        throw new AppError(400, 'Não é possível deletar a categoria pois existem produtos associados a ela');
    }

    await categoryRepository.deleteCategoryById(categoryId, tx);
};