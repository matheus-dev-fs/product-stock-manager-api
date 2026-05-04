import { RequestHandler } from "express";
import * as dashboardService from "../services/dashboard.service";
import { DateRange, dateRangeSchema } from "../validators/dashboard.validator";
import { StockMovementSummaryFormatted } from "../types/stock-movements/stock-movement-summary-formatted.type";

export const getInventoryValue: RequestHandler = async (req, res): Promise<void> => {
    const inventoryValue: number = await dashboardService.getInventoryValue();
    res.status(200).json({ error: null, data: { inventoryValue } });
}

export const getStockMovementsSummary: RequestHandler = async (req, res): Promise<void> => {
    const query: DateRange = dateRangeSchema.parse(req.query);
    const summaryFormatted: StockMovementSummaryFormatted = await dashboardService.getStockMovementsSummary(query);
    res.status(200).json({ error: null, data: summaryFormatted });
};