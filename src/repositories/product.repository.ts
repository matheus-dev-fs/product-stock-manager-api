import { and, eq, isNull } from "drizzle-orm";
import { products, Product } from "../db/schema";
import { db } from "../db/connection";

export const getProductByCategoryId = async (categoryId: string): Promise<Product | null> => {
    const productsList: Product[] = await db
        .select()
        .from(products)
        .where(and(eq(products.categoryId, categoryId), isNull(products.deletedAt)))
        .limit(1);

    if (productsList.length === 0) {
        return null;
    }

    return productsList[0];
};