import { Product } from "../../db/schema/index.js";

export type PublicProduct = Omit<Product, 'deletedAt' | 'updatedAt'>;