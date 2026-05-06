import { StockMovementSummaryFormatted } from "../types/stock-movements/stock-movement-summary-formatted.type.js";
import { StockMovementSummary } from "../types/stock-movements/stock-movement-summary.type.js";

export const formatStockMovementsSummary = (data: StockMovementSummary[]): StockMovementSummaryFormatted => {
    const summary: StockMovementSummaryFormatted = {
        in: { value: 0, count: 0 },
        out: { value: 0, count: 0 }
    }

    data.forEach((item: StockMovementSummary): void => {
        summary[item.type] = {
            value: item.totalValue,
            count: item.count
        }
    });

    return summary;
};