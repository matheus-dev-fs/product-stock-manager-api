import type { Product } from "../db/schema";
import type { PublicProduct } from "../types/products/public-product.type";
import { formatProduct } from "./products.helper";

describe('products.helper', () => {
    it('formats product data', () => {
        const data: Product = {
            id: '6546575765',
            name: 'Product 1',
            unitPrice: 100,
            quantity: '10',
            minimumQuantity: '5',
            maximumQuantity: '20',
            categoryId: "543534",
            unityType: 'un',
            deletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result: PublicProduct = formatProduct(data);

        expect(result).toEqual({
            id: '6546575765',
            name: 'Product 1',
            createdAt: data.createdAt,
            unitPrice: 100,
            quantity: '10',
            minimumQuantity: '5',
            maximumQuantity: '20',
            categoryId: "543534",
            unityType: 'un',
        });
    });
});
