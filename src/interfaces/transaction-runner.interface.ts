import type { DbTransaction } from "../types/database/database.types.js";

export interface TransactionRunner {
    run<T>(callback: (tx: DbTransaction) => Promise<T>): Promise<T>;
}