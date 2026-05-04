import { jest } from '@jest/globals';
import { AppError } from '../errors/app.error';
import type { NewProduct, Product } from '../db/schema';

import type * as categoryServiceObj from './category.service';
import type * as productServiceObj from './product.service';
import type * as productRepositoryObj from '../repositories/product.repository';

const categoryServiceMock = {
    getCategoryById: jest.fn<typeof categoryServiceObj.getCategoryById>(),
};

const productRepositoryMock = {
    createProduct: jest.fn<typeof productRepositoryObj.createProduct>(),
    getProductById: jest.fn<typeof productRepositoryObj.getProductById>(),
    updateProductById: jest.fn<typeof productRepositoryObj.updateProductById>(),
    deleteProductById: jest.fn<typeof productRepositoryObj.deleteProductById>(),
    listProducts: jest.fn<typeof productRepositoryObj.listProducts>(),
    getProductByCategoryId: jest.fn<typeof productRepositoryObj.getProductByCategoryId>(),
    getProductWithDetailsById: jest.fn<typeof productRepositoryObj.getProductWithDetailsById>(),
    getProductStockInfoById: jest.fn<typeof productRepositoryObj.getProductStockInfoById>(),
    updateProductQuantity: jest.fn<typeof productRepositoryObj.updateProductQuantity>(),
};

jest.unstable_mockModule('./category.service', () => categoryServiceMock);
jest.unstable_mockModule('../repositories/product.repository', () => productRepositoryMock);

describe('product.service', () => {
    let productService: typeof productServiceObj;

    beforeAll(async () => {
        productService = await import('./product.service');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('throws when category is invalid', async () => {
        categoryServiceMock.getCategoryById.mockResolvedValue(null);

        const productData: NewProduct = {
            name: 'Product A',
            categoryId: 'category-id',
            unitPrice: 10,
            unityType: 'un',
            quantity: '1',
            minimumQuantity: '1',
            maximumQuantity: '5',
        };

        await expect(productService.createProduct(productData)).rejects.toBeInstanceOf(AppError);
        await expect(productService.createProduct(productData)).rejects.toMatchObject({
            statusCode: 404,
        });
    });

    it('throws when maximum is less than minimum', async () => {
        categoryServiceMock.getCategoryById.mockResolvedValue({
            id: 'category-id',
            name: 'Category',
            createdAt: new Date('2024-01-01T00:00:00Z'),
        });

        const productData: NewProduct = {
            name: 'Product A',
            categoryId: 'category-id',
            unitPrice: 10,
            unityType: 'un',
            quantity: '1',
            minimumQuantity: '10',
            maximumQuantity: '5',
        };

        await expect(productService.createProduct(productData)).rejects.toBeInstanceOf(AppError);
        await expect(productService.createProduct(productData)).rejects.toMatchObject({
            statusCode: 400,
        });
    });

    it('creates and formats product', async () => {
        categoryServiceMock.getCategoryById.mockResolvedValue({
            id: 'category-id',
            name: 'Category',
            createdAt: new Date('2024-01-01T00:00:00Z'),
        });

        const productData: NewProduct = {
            name: 'Product A',
            categoryId: 'category-id',
            unitPrice: 10,
            unityType: 'un',
            quantity: '1',
            minimumQuantity: '1',
            maximumQuantity: '5',
        };

        const createdProduct: Product = {
            id: 'product-id',
            name: 'Product A',
            categoryId: 'category-id',
            unitPrice: 10,
            unityType: 'un',
            quantity: '1',
            minimumQuantity: '1',
            maximumQuantity: '5',
            deletedAt: null,
            createdAt: new Date('2024-01-01T00:00:00Z'),
            updatedAt: new Date('2024-01-01T00:00:00Z'),
        };

        productRepositoryMock.createProduct.mockResolvedValue(createdProduct);

        const result = await productService.createProduct(productData);

        expect(result).toEqual({
            id: 'product-id',
            name: 'Product A',
            categoryId: 'category-id',
            unitPrice: 10,
            unityType: 'un',
            quantity: '1',
            minimumQuantity: '1',
            maximumQuantity: '5',
            createdAt: new Date('2024-01-01T00:00:00Z'),
        });
    });
});
