export type StockMovementSummary = {
    type: 'in' | 'out';
    totalValue: number;
    count: number;
}