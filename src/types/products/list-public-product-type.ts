import { PublicProduct } from "./public-product.type";

export type ListPublicProducts = (PublicProduct & {
    categoryName: string | null;
})[];