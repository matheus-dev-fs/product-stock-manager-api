import { db } from "../db/connection"
import { categories, Category, NewCategory } from "../db/schema"
import { DatabaseError } from "../errors/database.error";

export const createCategory = async (categoryData: NewCategory): Promise<Category> => {
    const result: Category[] = await db.insert(categories).values(categoryData).returning();

    if (result.length === 0) {
        throw new DatabaseError('Erro ao criar categoria');
    }
    
    const newCategory: Category = result[0];
    return newCategory;
}