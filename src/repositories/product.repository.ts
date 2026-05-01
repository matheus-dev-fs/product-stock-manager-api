import { and, eq, ilike, isNull } from "drizzle-orm";
import { products, Product, NewProduct, categories } from "../db/schema";
import { db } from "../db/connection";
import { DatabaseError } from "../errors/database.error";
import { ListPublicProducts } from "../types/products/list-public-product-type";

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

export const listProducts = async (offset: number, limit: number, search?: string): Promise<ListPublicProducts> => {
    const query = db
        .select({
            id: products.id,
            name: products.name,
            categoryId: products.categoryId,
            unitPrice: products.unitPrice,
            unityType: products.unityType,
            quantity: products.quantity,
            minimumQuantity: products.minimumQuantity,
            maximumQuantity: products.maximumQuantity,
            createdAt: products.createdAt,
            categoryName: categories.name
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(isNull(products.deletedAt))
        .offset(offset)
        .limit(limit)
        .$dynamic();

    if (search) {
        query.where(ilike(products.name, `%${search}%`));
    }

    return await query;
};

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