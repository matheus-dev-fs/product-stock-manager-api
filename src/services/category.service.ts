import { PublicCategory } from "../types/categories/public-category.type";
import * as categoryRepository from "../repositories/category.repository";
import * as productService from "./product.service";
import { Category, NewCategory, Product } from "../db/schema";
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

export const getCategoryById = async (categoryId: string): Promise<PublicCategory | null> => {
    const category: Category | null = await categoryRepository.getCategoryById(categoryId);

    if (!category) {
        return null;
    }

    return formatCategory(category);
}

export const updateCategoryById = async (categoryId: string, categoryData: NewCategory): Promise<PublicCategory | null> => {
    const updatedCategoryData: NewCategory = {
        ...categoryData,
        updatedAt: new Date()
    }

    const updatedCategory: Category | null = await categoryRepository.updateCategoryById(categoryId, updatedCategoryData);

    if (!updatedCategory) {
        return null;
    }

    return formatCategory(updatedCategory);
};

export const deleteCategoryById = async (categoryId: string): Promise<void> => {
    const existingProductInCategory: Product | null = await productService.getProductByCategoryId(categoryId);

    if (existingProductInCategory) {
        throw new AppError(400, 'Não é possível deletar a categoria pois existem produtos associados a ela');
    }

    await categoryRepository.deleteCategoryById(categoryId);
};