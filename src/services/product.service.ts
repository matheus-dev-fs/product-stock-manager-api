import { Product } from "../db/schema";
import * as productRepository from "../repositories/product.repository";

export const getProductByCategoryId = async (categoryId: string): Promise<Product | null> => {
    const product: Product | null = await productRepository.getProductByCategoryId(categoryId);
    return product;
};