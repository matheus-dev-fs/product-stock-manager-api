import { PublicProduct } from "./public-product.type.js";

export type PublicProductWithDetails = (PublicProduct & {
    categoryName: string | null;
});