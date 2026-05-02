import { isNull, sql } from "drizzle-orm"
import { db } from "../db/connection"
import { products } from "../db/schema"

export const getInventoryValue = async (): Promise<number> => {
    const result: { inventoryValue: number }[] = await db
        .select({
            inventoryValue: sql<number>`SUM(${products.unitPrice} * ${products.quantity})`.mapWith(Number)
        })
        .from(products)
        .where(isNull(products.deletedAt))

    return result[0]?.inventoryValue ?? 0;
}