import { PublicCategory } from "../types/categories/public-category.type.js";
import * as categoryRepository from "../repositories/category.repository.js";
import * as productService from "./product.service.js";
import { Category, NewCategory } from "../db/schema/index.js";
import { formatCategory } from "../helpers/categories.helper.js";
import { CategoryWithProductCount } from "../types/categories/category-with-product-count.type.js";
import { AppError } from "../errors/app.error.js";
import { PublicProduct } from "../types/products/public-product.type.js";

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
    const existingProductInCategory: PublicProduct | null = await productService.getProductByCategoryId(categoryId);

    if (existingProductInCategory) {
        throw new AppError(400, 'Não é possível deletar a categoria pois existem produtos associados a ela');
    }

    await categoryRepository.deleteCategoryById(categoryId);
};