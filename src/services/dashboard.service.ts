import { Product } from "../db/schema/index.js";
import { formatProduct } from "../helpers/products.helper.js";
import { formatStockMovementsSummary } from "../helpers/stock-movements.helper.js";
import * as dashboardRepository from "../repositories/dashboard.repository.js";
import { PublicProduct } from "../types/products/public-product.type.js";
import { OutStockMovementGraphData } from "../types/stock-movements/out-stock-movement-graph.type.js";
import { StockMovementSummaryFormatted } from "../types/stock-movements/stock-movement-summary-formatted.type.js";
import { StockMovementSummary } from "../types/stock-movements/stock-movement-summary.type.js";
import { DateRange } from "../validators/dashboard.validator.js";

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

export const getLowStockProducts = async (): Promise<PublicProduct[]> => {
    const products: Product[] = await dashboardRepository.getLowStockProducts();
    return products.map(formatProduct);
}

export const getStagnantProducts = async (range: DateRange): Promise<PublicProduct[]> => {
    const products: Product[] = await dashboardRepository.getStagnantProducts(range);
    return products.map(formatProduct);
};