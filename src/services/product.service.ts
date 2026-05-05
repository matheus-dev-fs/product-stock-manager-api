import { NewProduct, Product } from "../db/schema/index.js";
import { PublicCategory } from "../types/categories/public-category.type.js";
import * as productRepository from "../repositories/product.repository.js";
import * as categoryService from "./category.service.js";
import { PublicProduct } from "../types/products/public-product.type.js";
import { formatProduct } from "../helpers/products.helper.js";
import { AppError } from "../errors/app.error.js";
import { isMaxGteMin } from "../helpers/quantities.helper.js";
import { PublicProductWithDetails } from "../types/products/public-product-with-details.type.js";
import type { DbTransaction } from "../types/database/database.types.js";
import { ProductStockInfo } from "../types/products/product-stock-info.type.js";

export const createProduct = async (productData: NewProduct): Promise<PublicProduct> => {
    const isCategoryValid: PublicCategory | null = await categoryService.getCategoryById(productData.categoryId);

    if (!isCategoryValid) {
        throw new AppError(404, 'Categoria não encontrada. Insira um categoryId válido para criar o produto');
    }

    if (!isMaxGteMin(productData.minimumQuantity, productData.maximumQuantity)) {
        throw new AppError(400, 'A quantidade máxima deve ser maior ou igual à quantidade mínima');
    }

    const createdProduct: Product = await productRepository.createProduct(productData);
    return formatProduct(createdProduct);
};

export const listProducts = async (offset: number, limit: number, search?: string): Promise<PublicProductWithDetails[]> => {
    const products: PublicProductWithDetails[] = await productRepository.listProducts(offset, limit, search);
    return products;
};

export const getProductByCategoryId = async (categoryId: string): Promise<PublicProduct | null> => {
    const product: Product | null = await productRepository.getProductByCategoryId(categoryId);
    return product ? formatProduct(product) : null;
};

export const getProductWithDetailsById = async (productId: string): Promise<PublicProductWithDetails | null> => {
    const product: PublicProductWithDetails | null = await productRepository.getProductWithDetailsById(productId);
    return product;
};

export const updateProductById = async (productId: string, productData: Partial<NewProduct>): Promise<PublicProduct | null> => {
    const existingProduct: Product | null = await productRepository.getProductById(productId);

    if (!existingProduct) {
        return null;
    }

    if (productData.categoryId) {
        const isCategoryValid: PublicCategory | null = await categoryService.getCategoryById(productData.categoryId);

        if (!isCategoryValid) {
            throw new AppError(404, 'Categoria não encontrada. Insira um categoryId válido para atualizar o produto');
        }
    }

    if (!isMaxGteMin(productData.minimumQuantity, productData.maximumQuantity)) {
        throw new AppError(400, 'A quantidade máxima deve ser maior ou igual à quantidade mínima');
    }

    const updatedProductData: Partial<NewProduct> = {
        ...productData,
        updatedAt: new Date()
    };

    const updatedProduct: Product | null = await productRepository.updateProductById(productId, updatedProductData);
    return updatedProduct ? formatProduct(updatedProduct) : null;
}

export const deleteProductById = async (productId: string): Promise<void> => {
    await productRepository.deleteProductById(productId);
}

export const getProductStockInfoById = async (
    tx: DbTransaction,
    productId: string
): Promise<ProductStockInfo | null> => {
    return await productRepository.getProductStockInfoById(tx, productId);
};

export const updateProductQuantity = async (
    tx: DbTransaction,
    productId: string,
    quantity: string
): Promise<void> => {
    await productRepository.updateProductQuantity(tx, productId, quantity);
};