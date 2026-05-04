export type StockMovementSummary = {
    type: 'IN' | 'OUT';
    totalValue: number;
    count: number;
}