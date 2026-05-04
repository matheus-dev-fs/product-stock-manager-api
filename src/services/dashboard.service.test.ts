import { jest } from '@jest/globals';
import type { Product } from '../db/schema';
import type { PublicProduct } from '../types/products/public-product.type';

import type * as productsHelperObj from '../helpers/products.helper';
import type * as stockMovementsHelperObj from '../helpers/stock-movements.helper';
import type * as dashboardRepositoryObj from '../repositories/dashboard.repository';
import type * as dashboardServiceObj from './dashboard.service';

const dashboardRepositoryMock = {
    getInventoryValue: jest.fn<typeof dashboardRepositoryObj.getInventoryValue>(),
    getStockMovementsSummary: jest.fn<typeof dashboardRepositoryObj.getStockMovementsSummary>(),
    getOutStockMovementsGraph: jest.fn<typeof dashboardRepositoryObj.getOutStockMovementsGraph>(),
    getLowStockProducts: jest.fn<typeof dashboardRepositoryObj.getLowStockProducts>(),
    getStagnantProducts: jest.fn<typeof dashboardRepositoryObj.getStagnantProducts>(),
};

const productsHelperMock = {
    formatProduct: jest.fn<typeof productsHelperObj.formatProduct>(),
};

const stockMovementsHelperMock = {
    formatStockMovementsSummary: jest.fn<typeof stockMovementsHelperObj.formatStockMovementsSummary>(),
};

jest.unstable_mockModule('../repositories/dashboard.repository', () => dashboardRepositoryMock);
jest.unstable_mockModule('../helpers/products.helper', () => productsHelperMock);
jest.unstable_mockModule('../helpers/stock-movements.helper', () => stockMovementsHelperMock);

describe('dashboard.service', () => {
    let dashboardService: typeof dashboardServiceObj;

    beforeAll(async () => {
        dashboardService = await import('./dashboard.service');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('gets inventory value', async () => {
        const expectedValue = 15000.50;
        dashboardRepositoryMock.getInventoryValue.mockResolvedValue(expectedValue);

        const result = await dashboardService.getInventoryValue();

        expect(dashboardRepositoryMock.getInventoryValue).toHaveBeenCalled();
        expect(result).toBe(expectedValue);
    });

    it('gets low stock products with formatted response', async () => {
        const mockDbProducts: Product[] = [
            {
                id: 'prod-1',
                categoryId: 'cat-1',
                name: 'Low Stock Item',
                unitPrice: 10,
                unityType: 'un',
                quantity: '2',
                minimumQuantity: '5',
                maximumQuantity: '100',
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ];

        const formattedProduct: PublicProduct = {
            id: 'prod-1',
            categoryId: 'cat-1',
            name: 'Low Stock Item',
            unitPrice: 10,
            unityType: 'un',
            quantity: '2',
            minimumQuantity: '5',
            maximumQuantity: '100',
            createdAt: mockDbProducts[0].createdAt
        };

        dashboardRepositoryMock.getLowStockProducts.mockResolvedValue(mockDbProducts);
        productsHelperMock.formatProduct.mockReturnValue(formattedProduct);

        const result = await dashboardService.getLowStockProducts();

        expect(dashboardRepositoryMock.getLowStockProducts).toHaveBeenCalled();
        expect(productsHelperMock.formatProduct).toHaveBeenCalledWith(mockDbProducts[0], 0, mockDbProducts);
        expect(result).toEqual([formattedProduct]);
    });
});
