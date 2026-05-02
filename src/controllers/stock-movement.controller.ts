import { RequestHandler } from "express";
import { createStockMovementSchema } from "../validators/stock-movement.validator";
import { AppError } from "../errors/app.error";
import * as stockMovementService from '../services/stock-movement.service';
import { StockMovement } from "../db/schema";

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