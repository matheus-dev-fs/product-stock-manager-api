import { NewStockMovement, StockMovement } from "../db/schema";
import { AppError } from "../errors/app.error";
import { transactionRunner } from "../db/transaction-runner";
import * as stockMovementRepository from "../repositories/stock-movement.repository";
import * as productService from "./product.service";
import { ProductStockInfo } from "../types/products/product-stock-info.type";
import type { DbTransaction } from "../types/database/database.types";
import { ListStockMovementsInput } from "../validators/stock-movement.validator";
import { StockMovementWithDetails } from "../types/stock-movements/stock-movement-with-details.type";

export const createStockMovement = async (data: Omit<NewStockMovement, 'unitPrice'>): Promise<StockMovement> => {
    return await transactionRunner.run<StockMovement>(async (txRunner: DbTransaction) => {
        const product: ProductStockInfo | null = await productService.getProductStockInfoById(txRunner, data.productId);

        if (!product) {
            throw new AppError(404, 'Produto não encontrado');
        }

        const currentQuantity: number = Number(product.quantity);
        const movementQuantity: number = Number(data.quantity);

        if (data.type === 'OUT') {
            if (movementQuantity > currentQuantity) {
                throw new AppError(400, `Quantidade de estoque insuficiente. Disponível: ${currentQuantity}, solicitado: ${movementQuantity}`);
            }
        }

        const stockMovement: StockMovement = await stockMovementRepository.createStockMovement(txRunner, {
            ...data,
            unitPrice: product.unitPrice,
        });

        const nextQuantity: number = data.type === 'IN'
            ? currentQuantity + movementQuantity
            : currentQuantity - movementQuantity;

        await productService.updateProductQuantity(
            txRunner,
            data.productId,
            nextQuantity.toString()
        );

        return stockMovement;
    });
};

export const listStockMovementsWithDetails = async (filters: ListStockMovementsInput): Promise<StockMovementWithDetails[]> => {
    return await stockMovementRepository.listStockMovementsWithDetails(filters);
}