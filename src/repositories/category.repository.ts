import { isNull, eq, and, sql } from "drizzle-orm";
import { db as database } from "../db/connection"
import { categories, Category, NewCategory, products, Product } from "../db/schema"
import { DatabaseError } from "../errors/database.error";
import { CategoryWithProductCount } from "../types/categories/category-with-product-count.type";

export const createCategory = async (categoryData: NewCategory): Promise<Category> => {
    const result: Category[] = await database.insert(categories).values(categoryData).returning();

    if (result.length === 0) {
        throw new DatabaseError('Erro ao criar categoria');
    }

    const newCategory: Category = result[0];
    return newCategory;
}

export const listPublicCategories = async (includeProductCount: boolean): Promise<CategoryWithProductCount[]> => {
    let categoriesList: CategoryWithProductCount[] = [];

    if (includeProductCount) {
        categoriesList = await database
            .select({
                id: categories.id,
                name: categories.name,
                createdAt: categories.createdAt,
                productCount: sql<number>`COUNT(${products.id})`.mapWith(Number)
            })
            .from(categories)
            .leftJoin(products, eq(categories.id, products.categoryId))
            .where(and(isNull(categories.deletedAt), isNull(products.deletedAt)))
            .groupBy(categories.id);
    } else {
        categoriesList = await database
            .select({
                id: categories.id,
                name: categories.name,
                createdAt: categories.createdAt
            })
            .from(categories)
            .where(isNull(categories.deletedAt));
    }

    return categoriesList;
}

export const getCategoryById = async (categoryId: string): Promise<Category | null> => {
    const category: Category[] | null = await database
        .select()
        .from(categories)
        .where(and(eq(categories.id, categoryId), isNull(categories.deletedAt)))
        .limit(1);
    return category[0];
};

export const updateCategoryById = async (categoryId: string, categoryData: NewCategory): Promise<Category | null> => {
    const result: Category[] = await database
        .update(categories)
        .set(categoryData)
        .where(and(eq(categories.id, categoryId), isNull(categories.deletedAt)))
        .returning();

    if (result.length === 0) {
        return null;
    }

    const updatedCategory: Category = result[0];
    return updatedCategory;
};

export const deleteCategoryById = async (categoryId: string): Promise<void> => {
    await database.update(categories)
        .set({ deletedAt: new Date() })
        .where(and(eq(categories.id, categoryId), isNull(categories.deletedAt)));
};