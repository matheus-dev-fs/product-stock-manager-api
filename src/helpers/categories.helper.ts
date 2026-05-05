import { Category } from "../db/schema/index.js";
import { PublicCategory } from "../types/categories/public-category.type.js";

export const formatCategory = (category: Category): PublicCategory => {
    const { id, name, createdAt } = category;
    return { id, name, createdAt };
}