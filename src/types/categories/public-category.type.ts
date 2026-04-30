import { Category } from "../../db/schema";

export type PublicCategory = Omit<Category, 'updatedAt' | 'deletedAt'>;