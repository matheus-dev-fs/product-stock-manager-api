import { TransactionRunner } from "../interfaces/transaction-runner.interface.js";
import { db as database } from "./connection.js";
import type { DbClient, DbTransaction } from "../types/database/database.types.js";

export class DrizzleTransactionRunner implements TransactionRunner {
    constructor(private readonly client: DbClient) {}

    run<T>(callback: (tx: DbTransaction) => Promise<T>): Promise<T> {
        return this.client.transaction(callback);
    }
}

export const transactionRunner = new DrizzleTransactionRunner(database);