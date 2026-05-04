import { gte, lte, isNull, sql, and, eq, SQL, lt } from "drizzle-orm"
import { db } from "../db/connection"
import { Product, products, stockMovements } from "../db/schema"
import { DateRange } from "../validators/dashboard.validator"
import { StockMovementSummary } from "../types/stock-movements/stock-movement-summary.type"
import { OutStockMovementGraphData } from "../types/stock-movements/out-stock-movement-graph.type"

export const getInventoryValue = async (): Promise<number> => {
    const result: { inventoryValue: number }[] = await db
        .select({
            inventoryValue: sql<number>`SUM(${products.unitPrice} * ${products.quantity})`.mapWith(Number)
        })
        .from(products)
        .where(isNull(products.deletedAt))

    return result[0]?.inventoryValue ?? 0;
}

export const getStockMovementsSummary = async (range: DateRange): Promise<StockMovementSummary[]> => {
    let query = db
        .select({
            type: stockMovements.type,
            totalValue: sql<number>`SUM(${stockMovements.quantity} * ${stockMovements.unitPrice})`.mapWith(Number),
            count: sql<number>`COUNT(*)`.mapWith(Number)
        })
        .from(stockMovements)
        .$dynamic()
        .groupBy(stockMovements.type);

    const conditions = [];

    if (range.startDate) {
        const startDate: Date = new Date(range.startDate);
        conditions.push(gte(stockMovements.createdAt, startDate));
    }

    if (range.endDate) {
        const endDate: Date = new Date(range.endDate);
        endDate.setUTCHours(23, 59, 59, 999);
        conditions.push(lte(stockMovements.createdAt, endDate));
    }

    if (conditions.length > 0) {
        query = query.where(and(...conditions));
    }

    return await query;
}

export const getOutStockMovementsGraph = async (range: DateRange): Promise<OutStockMovementGraphData[]> => {
    const dateFormattedSQL: SQL<string> = sql<string>`TO_CHAR(${stockMovements.createdAt}, 'YYYY-MM-DD')`.mapWith(String);

    let query = db
        .select({
            date: dateFormattedSQL,
            totalValue: sql<number>`SUM(${stockMovements.quantity} * ${stockMovements.unitPrice})`.mapWith(Number)
        })
        .from(stockMovements)
        .groupBy(dateFormattedSQL)
        .orderBy(dateFormattedSQL)
        .$dynamic();

    const conditions = [eq(stockMovements.type, 'OUT')];

    if (range.startDate) {
        const startDate: Date = new Date(range.startDate);
        conditions.push(gte(stockMovements.createdAt, startDate));
    }

    if (range.endDate) {
        const endDate: Date = new Date(range.endDate);
        endDate.setUTCHours(23, 59, 59, 999);
        conditions.push(lte(stockMovements.createdAt, endDate));
    }

    if (conditions.length > 0) {
        query = query.where(and(...conditions));
    }

    return await query;
}

export const getLowStockProducts = async (): Promise<Product[]> => {
    const results = await db.
        select()
        .from(products)
        .where(
            and(
                sql<boolean>`(${products.quantity} <= (${products.minimumQuantity} * 1.1))`.mapWith(Boolean),
                isNull(products.deletedAt)
            )
        )
        .orderBy(products.quantity);

    return results;
}

export const getStagnantProducts = async (range: DateRange): Promise<Product[]> => {
    const conditions = [eq(stockMovements.type, 'OUT')];

    if (range.startDate) {
        const startDate: Date = new Date(range.startDate);
        conditions.push(gte(stockMovements.createdAt, startDate));
    }

    if (range.endDate) {
        const endDate: Date = new Date(range.endDate);
        endDate.setUTCHours(23, 59, 59, 999);
        conditions.push(lte(stockMovements.createdAt, endDate));
    }

    const results: Product[] = await db
        .select()
        .from(products)
        .where(
            and(
                isNull(products.deletedAt),
                sql<boolean>`${products.id} NOT IN (
                    SELECT DISTINCT ${stockMovements.productId}
                    FROM ${stockMovements}
                    WHERE ${and(...conditions)}
                )`.mapWith(Boolean)
            )
        )

    return results;
};