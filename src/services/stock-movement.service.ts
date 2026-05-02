import { NewStockMovement, StockMovement } from "../db/schema";
import { AppError } from "../errors/app.error";
import { transactionRunner } from "../db/transaction-runner";
import * as stockMovementRepository from "../repositories/stock-movement.repository";
import * as productService from "./product.service";
import { ProductStockInfo } from "../types/products/product-stock-info.type";
import type { DbTransaction } from "../types/database/database.types";

export const createStockMovement = async (data: Omit<NewStockMovement, 'unitPrice'>): Promise<StockMovement> => {
    return await transactionRunner.run<StockMovement>(async (txRunner: DbTransaction) => {
        const product: ProductStockInfo | null = await productService.getProductStockInfoById(txRunner, data.productId);

        if (!product) {
            throw new AppError(404, 'Produto não encontrado');
        }

        const currentQuantity: number = Number(product.quantity);
        const currentMinimumQuantity: number = Number(product.minimumQuantity);
        const currentMaximumQuantity: number = Number(product.maximumQuantity);
        const movementQuantity: number = Number(data.quantity);

        if (data.type === 'OUT') {
            if (movementQuantity > currentQuantity) {
                throw new AppError(400, `Quantidade de estoque insuficiente. Disponível: ${currentQuantity}, solicitado: ${movementQuantity}`);
            }

            if ((currentQuantity - movementQuantity) < currentMinimumQuantity) {
                throw new AppError(400, `A quantidade de estoque após o movimento ficaria abaixo da quantidade mínima. Quantidade atual: ${currentQuantity}, quantidade do movimento: ${movementQuantity}, quantidade mínima: ${currentMinimumQuantity}`);
            }
        }

        if (data.type === 'IN') {
            if ((currentQuantity + movementQuantity) > currentMaximumQuantity) {
                throw new AppError(400, `A quantidade de estoque após o movimento ficaria acima da quantidade máxima. Quantidade atual: ${currentQuantity}, quantidade do movimento: ${movementQuantity}, quantidade máxima: ${currentMaximumQuantity}`);
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