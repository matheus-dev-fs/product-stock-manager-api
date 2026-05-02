import { PublicProduct } from "./public-product.type";

export type PublicProductWithDetails = (PublicProduct & {
    categoryName: string | null;
});