import { jest } from '@jest/globals';
import { AppError } from '../errors/app.error';
import type { StockMovement } from '../db/schema';
import type { DbTransaction } from '../types/database/database.types';
import type { transactionRunner } from '../db/transaction-runner';

import type * as productServiceObj from './product.service';
import type * as stockMovementServiceObj from './stock-movement.service';
import type * as stockMovementRepositoryObj from '../repositories/stock-movement.repository';

const transactionRunnerMock = {
    run: jest.fn<typeof transactionRunner.run>(),
};

const productServiceMock = {
    getProductStockInfoById: jest.fn<typeof productServiceObj.getProductStockInfoById>(),
    updateProductQuantity: jest.fn<typeof productServiceObj.updateProductQuantity>(),
};

const stockMovementRepositoryMock = {
    createStockMovement: jest.fn<typeof stockMovementRepositoryObj.createStockMovement>(),
    listStockMovementsWithDetails: jest.fn<typeof stockMovementRepositoryObj.listStockMovementsWithDetails>(),
};

jest.unstable_mockModule('../db/transaction-runner', () => ({ transactionRunner: transactionRunnerMock }));
jest.unstable_mockModule('./product.service', () => productServiceMock);
jest.unstable_mockModule('../repositories/stock-movement.repository', () => stockMovementRepositoryMock);

describe('stock-movement.service', () => {
    let stockMovementService: typeof stockMovementServiceObj;

    beforeAll(async () => {
        stockMovementService = await import('./stock-movement.service');
    });

    beforeEach(() => {
        jest.clearAllMocks();
        transactionRunnerMock.run.mockImplementation(async <T>(fn: (tx: DbTransaction) => Promise<T>): Promise<T> => {
            return await fn({} as DbTransaction);
        });
    });

    it('throws when stock is insufficient for OUT', async () => {
        productServiceMock.getProductStockInfoById.mockResolvedValue({
            quantity: '5',
            unitPrice: 10,
        });

        await expect(stockMovementService.createStockMovement({
            productId: 'product-id',
            userId: 'user-id',
            type: 'OUT',
            quantity: '10',
        })).rejects.toBeInstanceOf(AppError);

        expect(stockMovementRepositoryMock.createStockMovement).not.toHaveBeenCalled();
    });

    it('creates movement and updates product quantity for IN', async () => {
        productServiceMock.getProductStockInfoById.mockResolvedValue({
            quantity: '5',
            unitPrice: 10,
        });

        const createdMovement: StockMovement = {
            id: 'movement-id',
            productId: 'product-id',
            userId: 'user-id',
            type: 'IN',
            quantity: '2',
            unitPrice: 10,
            createdAt: new Date('2024-01-01T00:00:00Z'),
        };

        stockMovementRepositoryMock.createStockMovement.mockResolvedValue(createdMovement);

        const result = await stockMovementService.createStockMovement({
            productId: 'product-id',
            userId: 'user-id',
            type: 'IN',
            quantity: '2',
        });

        expect(stockMovementRepositoryMock.createStockMovement).toHaveBeenCalledWith(expect.anything(), {
            productId: 'product-id',
            userId: 'user-id',
            type: 'IN',
            quantity: '2',
            unitPrice: 10,
        });

        expect(productServiceMock.updateProductQuantity).toHaveBeenCalledWith(expect.anything(), 'product-id', '7');
        expect(result).toEqual(createdMovement);
    });
});
