import { StockMovementSummaryFormatted } from "../types/stock-movements/stock-movement-summary-formatted.type";
import { StockMovementSummary } from "../types/stock-movements/stock-movement-summary.type";

export const formatStockMovementsSummary = (data: StockMovementSummary[]): StockMovementSummaryFormatted => {
    const summary: StockMovementSummaryFormatted = {
        IN: { value: 0, count: 0 },
        OUT: { value: 0, count: 0 }
    }

    data.forEach((item: StockMovementSummary): void => {
        summary[item.type] = {
            value: item.totalValue,
            count: item.count
        }
    });

    return summary;
};