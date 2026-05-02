import { and, eq, ilike, isNull } from "drizzle-orm";
import { products, Product, NewProduct, categories } from "../db/schema";
import { db as database } from "../db/connection";
import { DatabaseError } from "../errors/database.error";
import { PublicProductWithDetails } from "../types/products/list-public-product-type";
import { ProductStockInfo } from "../types/products/product-stock-info.type";

type DbClient = typeof database;

export const createProduct = async (productData: NewProduct, tx?: unknown): Promise<Product> => {
    const client: DbClient = (tx ?? database) as DbClient;
    const createdProducts: Product[] = await client
        .insert(products)
        .values(productData)
        .returning();

    if (createdProducts.length === 0) {
        throw new DatabaseError('Erro ao criar o produto');
    }

    return createdProducts[0];
}

export const listProducts = async (offset: number, limit: number, search?: string, tx?: unknown): Promise<PublicProductWithDetails[]> => {
    const client: DbClient = (tx ?? database) as DbClient;
    const query = client
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

export const getProductById = async (productId: string, tx?: unknown): Promise<Product | null> => {
    const client: DbClient = (tx ?? database) as DbClient;
    const productsList: Product[] = await client
        .select()
        .from(products)
        .where(
            and(
                eq(products.id, productId), 
                isNull(products.deletedAt)
            )
        )
        .limit(1);

    if (productsList.length === 0) {
        return null;
    }

    return productsList[0];
}

export const getProductByCategoryId = async (categoryId: string, tx?: unknown): Promise<Product | null> => {
    const client: DbClient = (tx ?? database) as DbClient;
    const productsList: Product[] = await client
        .select()
        .from(products)
        .where(
            and(
                eq(products.categoryId, categoryId),
                isNull(products.deletedAt)
            )
        )
        .limit(1);

    if (productsList.length === 0) {
        return null;
    }

    return productsList[0];
};

export const getProductByIdWithCategory = async (productId: string, tx?: unknown): Promise<PublicProductWithDetails | null> => {
    const client: DbClient = (tx ?? database) as DbClient;
    const product: PublicProductWithDetails[] = await client
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
        .where(
            and(
                eq(products.id, productId),
                isNull(products.deletedAt)
            )
        )
        .limit(1);

    if (product.length === 0) {
        return null;
    }

    return product[0];
};

export const updateProductById = async (productId: string, productData: Partial<NewProduct>, tx?: unknown): Promise<Product | null> => {
    const client: DbClient = (tx ?? database) as DbClient;
    const updatedProducts: Product[] = await client
        .update(products)
        .set(productData)
        .where(
            and(
                eq(products.id, productId),
                isNull(products.deletedAt)
            )
        )
        .returning();

    if (updatedProducts.length === 0) {
        return null;
    }

    return updatedProducts[0];
};

export const deleteProductById = async (productId: string, tx?: unknown): Promise<void> => {
    const client: DbClient = (tx ?? database) as DbClient;
    await client
        .update(products)
        .set({ deletedAt: new Date() })
        .where(
            and(
                eq(products.id, productId), 
                isNull(products.deletedAt)
            )
        );
};

export const getProductStockInfoById = async (
    productId: string,
    tx?: unknown
): Promise<ProductStockInfo | null> => {
    const client: DbClient = (tx ?? database) as DbClient;

    const productResult: ProductStockInfo[] = await client
        .select({
            quantity: products.quantity,
            unitPrice: products.unitPrice,
        })
        .from(products)
        .where(
            and(
                eq(products.id, productId),
                isNull(products.deletedAt)
            )
        )
        .for('update');

    if (productResult.length === 0) {
        return null;
    }

    return productResult[0];
};

export const updateProductQuantity = async (
    productId: string,
    quantity: string,
    tx?: unknown
): Promise<void> => {
    const client: DbClient = (tx ?? database) as DbClient;

    await client
        .update(products)
        .set({
            quantity,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(products.id, productId),
                isNull(products.deletedAt)
            )
        );
};