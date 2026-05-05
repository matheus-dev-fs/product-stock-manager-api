import { PublicCategory } from "./public-category.type.js";

export type CategoryWithProductCount = PublicCategory & {
    productCount?: number;
}