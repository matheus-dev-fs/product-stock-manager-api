import { isNull, eq, and, sql } from "drizzle-orm";
import { db } from "../db/connection"
import { categories, Category, NewCategory, products, Product } from "../db/schema"
import { DatabaseError } from "../errors/database.error";
import { CategoryWithProductCount } from "../types/categories/category-with-product-count.type";

export const createCategory = async (categoryData: NewCategory): Promise<Category> => {
    const result: Category[] = await db.insert(categories).values(categoryData).returning();

    if (result.length === 0) {
        throw new DatabaseError('Erro ao criar categoria');
    }

    const newCategory: Category = result[0];
    return newCategory;
}

export const listPublicCategories = async (includeProductCount: boolean): Promise<CategoryWithProductCount[]> => {
    let categoriesList: CategoryWithProductCount[] = [];

    if (includeProductCount) {
        categoriesList = await db
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
        categoriesList = await db
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