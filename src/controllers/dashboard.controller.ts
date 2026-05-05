import { RequestHandler } from "express";
import * as dashboardService from "../services/dashboard.service.js";
import { DateRange, dateRangeSchema } from "../validators/dashboard.validator.js";
import { StockMovementSummaryFormatted } from "../types/stock-movements/stock-movement-summary-formatted.type.js";
import { OutStockMovementGraphData } from "../types/stock-movements/out-stock-movement-graph.type.js";
import { PublicProduct } from "../types/products/public-product.type.js";

export const getInventoryValue: RequestHandler = async (req, res): Promise<void> => {
    const inventoryValue: number = await dashboardService.getInventoryValue();
    res.status(200).json({ error: null, data: { inventoryValue } });
}

export const getStockMovementsSummary: RequestHandler = async (req, res): Promise<void> => {
    const query: DateRange = dateRangeSchema.parse(req.query);
    const summaryFormatted: StockMovementSummaryFormatted = await dashboardService.getStockMovementsSummary(query);
    res.status(200).json({ error: null, data: summaryFormatted });
};

export const getOutStockMovementsGraph: RequestHandler = async (req, res): Promise<void> => {
    const query: DateRange = dateRangeSchema.parse(req.query);
    const outGraphData: OutStockMovementGraphData[] = await dashboardService.getOutStockMovementsGraph(query);
    res.status(200).json({ error: null, data: outGraphData });
};

export const getLowStockProducts: RequestHandler = async (req, res): Promise<void> => {
    const lowStockProducts: PublicProduct[] = await dashboardService.getLowStockProducts();
    res.status(200).json({ error: null, data: lowStockProducts });
}

export const getStagnantProducts: RequestHandler = async (req, res): Promise<void> => {
    const query: DateRange = dateRangeSchema.parse(req.query);
    const stagnantProducts: PublicProduct[] = await dashboardService.getStagnantProducts(query);
    res.status(200).json({ error: null, data: stagnantProducts });
}