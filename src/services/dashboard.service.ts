import { formatStockMovementsSummary } from "../helpers/stock-movements.helper";
import * as dashboardRepository from "../repositories/dashboard.repository";
import { OutStockMovementGraphData } from "../types/stock-movements/out-stock-movement-graph.type";
import { StockMovementSummaryFormatted } from "../types/stock-movements/stock-movement-summary-formatted.type";
import { StockMovementSummary } from "../types/stock-movements/stock-movement-summary.type";
import { DateRange } from "../validators/dashboard.validator";

export const getInventoryValue = async (): Promise<number> => {
    const inventoryValue: number = await dashboardRepository.getInventoryValue();
    return inventoryValue;
};

export const getStockMovementsSummary = async (range: DateRange): Promise<StockMovementSummaryFormatted> => {
    const result: StockMovementSummary[] = await dashboardRepository.getStockMovementsSummary(range);
    return formatStockMovementsSummary(result);
};

export const getOutStockMovementsGraph = async (range: DateRange): Promise<OutStockMovementGraphData[]> => {
    const result: OutStockMovementGraphData[] = await dashboardRepository.getOutStockMovementsGraph(range);
    return result;
};