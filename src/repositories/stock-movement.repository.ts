import { and, eq, isNull } from "drizzle-orm";
import { db as database } from "../db/connection";
import { NewStockMovement, StockMovement, stockMovements } from "../db/schema";
import { DatabaseError } from "../errors/database.error";

type DbClient = typeof database;

export const createStockMovement = async (
	data: NewStockMovement,
	tx?: unknown
): Promise<StockMovement> => {
	const client: DbClient = (tx ?? database) as DbClient;

	const [createdStockMovement]: StockMovement[] = await client
		.insert(stockMovements)
		.values(data)
		.returning();

    if (!createdStockMovement) {
        throw new DatabaseError('Erro ao criar o movimento de estoque');
    }

	return createdStockMovement;
};
