import { Product } from "../db/schema";
import { PublicProduct } from "../types/products/public-product.type";

export const formatProduct = (product: Product): PublicProduct => {
    const { deletedAt, updatedAt, ...publicProduct } = product;
    return publicProduct;
};