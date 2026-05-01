import { Product } from "../../db/schema";

export type PublicProduct = Omit<Product, 'deletedAt' | 'updatedAt'>;