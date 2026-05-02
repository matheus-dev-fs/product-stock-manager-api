import { TransactionRunner } from "../interfaces/transaction-runner.interface";
import { db as database } from "./connection";

type DbClient = typeof database;
type DbTransaction = Parameters<Parameters<DbClient['transaction']>[0]>[0];

export class DrizzleTransactionRunner implements TransactionRunner {
    constructor(private readonly client: DbClient) {}

    run<T>(callback: (tx: DbTransaction) => Promise<T>): Promise<T> {
        return this.client.transaction(callback);
    }
}

export const transactionRunner = new DrizzleTransactionRunner(database);