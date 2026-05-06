import { NewStockMovement, StockMovement } from "../db/schema/index.js";
import { AppError } from "../errors/app.error.js";
import { transactionRunner } from "../db/transaction-runner.js";
import * as stockMovementRepository from "../repositories/stock-movement.repository.js";
import * as productService from "./product.service.js";
import { ProductStockInfo } from "../types/products/product-stock-info.type.js";
import type { DbTransaction } from "../types/database/database.types.js";
import { ListStockMovementsInput } from "../validators/stock-movement.validator.js";
import { StockMovementWithDetails } from "../types/stock-movements/stock-movement-with-details.type.js";

export const createStockMovement = async (data: Omit<NewStockMovement, 'unitPrice'>): Promise<StockMovement> => {
    return await transactionRunner.run<StockMovement>(async (txRunner: DbTransaction): Promise<StockMovement> => {
        const product: ProductStockInfo | null = await productService.getProductStockInfoById(txRunner, data.productId);

        if (!product) {
            throw new AppError(404, 'Produto não encontrado');
        }

        const currentQuantity: number = Number(product.quantity);
        const movementQuantity: number = Number(data.quantity);

        if (data.type === 'out' && movementQuantity > currentQuantity) {
            throw new AppError(400, `Quantidade de estoque insuficiente. Disponível: ${currentQuantity}, solicitado: ${movementQuantity}`);
        }

        const stockMovement: StockMovement = await stockMovementRepository.createStockMovement(txRunner, {
            ...data,
            unitPrice: product.unitPrice,
        });

        const nextQuantity: number = data.type === 'in'
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