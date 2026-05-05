import { Category } from "../../db/schema/index.js";

export type PublicCategory = Omit<Category, 'updatedAt' | 'deletedAt'>;