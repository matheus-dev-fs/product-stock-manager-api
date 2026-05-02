import type { DbTransaction } from "../types/database/database.types";

export interface TransactionRunner {
    run<T>(callback: (tx: DbTransaction) => Promise<T>): Promise<T>;
}