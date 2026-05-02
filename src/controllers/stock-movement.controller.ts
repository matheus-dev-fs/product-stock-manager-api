import { RequestHandler } from "express";
import { createStockMovementSchema, listStockMovementsSchema } from "../validators/stock-movement.validator";
import { AppError } from "../errors/app.error";
import * as stockMovementService from '../services/stock-movement.service';
import { StockMovement } from "../db/schema";
import { StockMovementWithDetails } from "../types/stock-movements/stock-movement-with-details.type";

export const createStockMovement: RequestHandler = async (req, res): Promise<void> => {
    if (!req.user) {
        throw new AppError(401, 'Usuário não autenticado');
    }

    const createStockMovementData = createStockMovementSchema.parse(req.body);
    const stockMovement: StockMovement = await stockMovementService.createStockMovement({
        ...createStockMovementData,
        userId: req.user.id
    });

    res.status(201).json({ error: null, data: stockMovement });
};

export const listStockMovementsWithDetails: RequestHandler = async (req, res): Promise<void> => {
    const filtersData = listStockMovementsSchema.parse(req.query);
    const stockMovements: StockMovementWithDetails[] = await stockMovementService.listStockMovementsWithDetails(filtersData);
    res.status(200).json({ error: null, data: stockMovements });
};