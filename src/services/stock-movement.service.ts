import { NewStockMovement, StockMovement } from "../db/schema";
import { AppError } from "../errors/app.error";
import { transactionRunner } from "../db/transaction-runner";
import * as stockMovementRepository from "../repositories/stock-movement.repository";
import * as productService from "./product.service";
import { ProductStockInfo } from "../types/products/product-stock-info.type";

export const createStockMovement = async (data: Omit<NewStockMovement, 'unitPrice'>, tx?: unknown): Promise<StockMovement> => {
    return await transactionRunner.run<StockMovement>(async (txRunner) => {
        const product: ProductStockInfo | null = await productService.getProductStockInfoById(data.productId, txRunner);

        if (!product) {
            throw new AppError(404, 'Produto não encontrado');
        }

        const currentQuantity: number = Number(product.quantity);
        const movementQuantity: number = Number(data.quantity);

        if (data.type === 'OUT' && movementQuantity > currentQuantity) {
            throw new AppError(400, `Quantidade de estoque insuficiente. Disponível: ${currentQuantity}, solicitado: ${movementQuantity}`);
        }

        const stockMovement: StockMovement = await stockMovementRepository.createStockMovement({
            ...data,
            unitPrice: product.unitPrice,
        }, txRunner);

        const nextQuantity: number = data.type === 'IN'
            ? currentQuantity + movementQuantity
            : currentQuantity - movementQuantity;

        await productService.updateProductQuantity(
            data.productId,
            nextQuantity.toString(),
            txRunner
        );

        return stockMovement;
    });
};