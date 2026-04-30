import { Category } from "../db/schema";
import { PublicCategory } from "../types/categories/public-category.type";

export const formatCategory = (category: Category): PublicCategory => {
    const { id, name, createdAt } = category;
    return { id, name, createdAt };
}