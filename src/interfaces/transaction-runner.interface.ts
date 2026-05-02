export interface TransactionRunner {
    run<T>(callback: (tx: unknown) => Promise<T>): Promise<T>;
}