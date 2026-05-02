import { NewStockMovement, StockMovement, stockMovements } from "../db/schema";
import { DatabaseError } from "../errors/database.error";
import type { DbTransaction } from "../types/database/database.types";

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
