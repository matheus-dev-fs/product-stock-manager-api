import { desc, eq } from "drizzle-orm";
import { NewStockMovement, products, StockMovement, stockMovements } from "../db/schema/index.js";
import { DatabaseError } from "../errors/database.error.js";
import type { DbTransaction } from "../types/database/database.types.js";
import { db } from "../db/connection.js";
import { ListStockMovementsInput } from "../validators/stock-movement.validator.js";
import { StockMovementWithDetails } from "../types/stock-movements/stock-movement-with-details.type.js";

export const createStockMovement = async (
    tx: DbTransaction,
    data: NewStockMovement,
): Promise<StockMovement> => {
    const [createdStockMovement]: StockMovement[] = await tx
        .insert(stockMovements)
        .values(data)
        .returning();

    if (!createdStockMovement) {
        throw new DatabaseError('Erro ao criar o movimento de estoque');
    }

    return createdStockMovement;
};

export const listStockMovementsWithDetails = async (filters: ListStockMovementsInput): Promise<StockMovementWithDetails[]> => {
    const { offset, limit, productId } = filters;

    const query = db
        .select({
            id: stockMovements.id,
            productId: stockMovements.productId,
            productName: products.name,
            userId: stockMovements.userId,
            type: stockMovements.type,
            quantity: stockMovements.quantity,
            unitPrice: stockMovements.unitPrice,
            createdAt: stockMovements.createdAt
        })
        .from(stockMovements)
        .leftJoin(products, eq(stockMovements.productId, products.id))
        .orderBy(desc(stockMovements.createdAt))
        .offset(offset)
        .limit(limit)
        .$dynamic();

    if (productId) {
        query.where(eq(stockMovements.productId, productId));
    }

    return await query;
};