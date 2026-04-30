import { PublicCategory } from "./public-category.type";

export type CategoryWithProductCount = PublicCategory & {
    productCount?: number;
}