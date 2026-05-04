import { gte, lte,isNull, sql, and } from "drizzle-orm"
import { db } from "../db/connection"
import { products, stockMovements } from "../db/schema"
import { DateRange } from "../validators/dashboard.validator"
import { StockMovementSummary } from "../types/stock-movements/stock-movement-summary.type"

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