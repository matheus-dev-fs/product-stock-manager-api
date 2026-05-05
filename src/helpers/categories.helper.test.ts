import type { Category } from "../db/schema";
import type { PublicCategory } from "../types/categories/public-category.type";
import { formatCategory } from "./categories.helper";

describe('categories.helper', () => {
    it('formats category data', () => {
        const data: Category = {
            id: '123456',
            name: 'Category 1',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        };

        const result: PublicCategory = formatCategory(data);

        expect(result).toEqual({
            id: '123456',
            name: 'Category 1',
            createdAt: data.createdAt,
        });
    });
});