import { and, eq, isNull } from "drizzle-orm";
import { products, Product, NewProduct } from "../db/schema";
import { db } from "../db/connection";
import { DatabaseError } from "../errors/database.error";

export const createProduct = async (productData: NewProduct): Promise<Product> => {
    const createdProducts: Product[] = await db
        .insert(products)
        .values(productData)
        .returning();

    if (createdProducts.length === 0) {
        throw new DatabaseError('Erro ao criar o produto');
    }

    return createdProducts[0];
}

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