import { jest } from '@jest/globals';
import { AppError } from '../errors/app.error';

import type * as productServiceObj from './product.service';
import type * as categoryServiceObj from './category.service';
import type * as categoryRepositoryObj from '../repositories/category.repository';

const productServiceMock = {
    getProductByCategoryId: jest.fn<typeof productServiceObj.getProductByCategoryId>(),
};

const categoryRepositoryMock = {
    deleteCategoryById: jest.fn<typeof categoryRepositoryObj.deleteCategoryById>(),
    createCategory: jest.fn<typeof categoryRepositoryObj.createCategory>(),
    listPublicCategories: jest.fn<typeof categoryRepositoryObj.listPublicCategories>(),
    getCategoryById: jest.fn<typeof categoryRepositoryObj.getCategoryById>(),
    updateCategoryById: jest.fn<typeof categoryRepositoryObj.updateCategoryById>(),
};

jest.unstable_mockModule('./product.service', () => productServiceMock);
jest.unstable_mockModule('../repositories/category.repository', () => categoryRepositoryMock);

describe('category.service', () => {
    let categoryService: typeof categoryServiceObj;

    beforeAll(async () => {
        categoryService = await import('./category.service');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('throws when category has products', async () => {
        productServiceMock.getProductByCategoryId.mockResolvedValue({
            id: 'product-id',
            name: 'Product',
            createdAt: new Date(),
            categoryId: 'category-id',
            unitPrice: 15,
            unityType: 'un',
            quantity: '10',
            minimumQuantity: '5',
            maximumQuantity: '20'
        });

        await expect(categoryService.deleteCategoryById('category-id')).rejects.toBeInstanceOf(AppError);
        await expect(categoryService.deleteCategoryById('category-id')).rejects.toMatchObject({
            statusCode: 400,
        });
    });

    it('deletes category when no products exist', async () => {
        productServiceMock.getProductByCategoryId.mockResolvedValue(null);

        await categoryService.deleteCategoryById('category-id');

        expect(categoryRepositoryMock.deleteCategoryById).toHaveBeenCalledWith('category-id');
    });
});
