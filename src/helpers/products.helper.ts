import { Product } from "../db/schema/index.js";
import { PublicProduct } from "../types/products/public-product.type.js";

export const formatProduct = (product: Product): PublicProduct => {
    const { deletedAt, updatedAt, ...publicProduct } = product;
    return publicProduct;
};