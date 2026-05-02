import { NewProduct, Product } from "../db/schema";
import { PublicCategory } from "../types/categories/public-category.type";
import * as productRepository from "../repositories/product.repository";
import * as categoryService from "./category.service";
import { PublicProduct } from "../types/products/public-product.type";
import { formatProduct } from "../helpers/products.helper";
import { AppError } from "../errors/app.error";
import { isMaxGteMin, isQuantityGteMin, isQuantityLteMax } from "../helpers/quantities.helper";
import { PublicProductWithDetails } from "../types/products/list-public-product-type";
import type { TransactionRunner } from "../interfaces/transaction-runner.interface";
import { ProductStockInfo } from "../types/products/product-stock-info.type";

export const createProduct = async (productData: NewProduct, tx?: unknown): Promise<PublicProduct> => {
    const isCategoryValid: PublicCategory | null = await categoryService.getCategoryById(productData.categoryId, tx);

    if (!isCategoryValid) {
        throw new AppError(404, 'Categoria não encontrada. Insira um categoryId válido para criar o produto');
    }

    if (!isMaxGteMin(productData.minimumQuantity, productData.maximumQuantity)) {
        throw new AppError(400, 'A quantidade máxima deve ser maior ou igual à quantidade mínima');
    }

    if (!isQuantityGteMin(productData.quantity, productData.minimumQuantity)) {
        throw new AppError(400, 'A quantidade do produto não pode ser menor que a quantidade mínima');
    }

    if (!isQuantityLteMax(productData.quantity, productData.maximumQuantity)) {
        throw new AppError(400, 'A quantidade do produto não pode ser maior que a quantidade máxima');
    }

    const createdProduct: Product = await productRepository.createProduct(productData, tx);
    return formatProduct(createdProduct);
};

export const listProducts = async (offset: number, limit: number, search?: string, tx?: unknown): Promise<PublicProductWithDetails[]> => {
    const products: PublicProductWithDetails[] = await productRepository.listProducts(offset, limit, search, tx);
    return products;
};

export const getProductByCategoryId = async (categoryId: string, tx?: unknown): Promise<PublicProduct | null> => {
    const product: Product | null = await productRepository.getProductByCategoryId(categoryId, tx);
    return product ? formatProduct(product) : null;
};

export const getProductByIdWithCategory = async (productId: string, tx?: unknown): Promise<PublicProductWithDetails | null> => {
    const product: PublicProductWithDetails | null = await productRepository.getProductByIdWithCategory(productId, tx);
    return product;
};

export const updateProductById = async (productId: string, productData: Partial<NewProduct>, tx?: unknown): Promise<PublicProduct | null> => {
    const existingProduct: Product | null = await productRepository.getProductById(productId, tx);

    if (!existingProduct) {
        return null;
    }

    if (productData.categoryId) {
        const isCategoryValid: PublicCategory | null = await categoryService.getCategoryById(productData.categoryId, tx);

        if (!isCategoryValid) {
            throw new AppError(404, 'Categoria não encontrada. Insira um categoryId válido para atualizar o produto');
        }
    }

    if (!isMaxGteMin(productData.minimumQuantity, productData.maximumQuantity)) {
        throw new AppError(400, 'A quantidade máxima deve ser maior ou igual à quantidade mínima');
    }

    if (!isQuantityGteMin(productData.quantity, productData.minimumQuantity)) {
        throw new AppError(400, 'A quantidade do produto não pode ser menor que a quantidade mínima');
    }

    if (!isQuantityLteMax(productData.quantity, productData.maximumQuantity)) {
        throw new AppError(400, 'A quantidade do produto não pode ser maior que a quantidade máxima');
    }

    const updatedProductData: Partial<NewProduct> = {
        ...productData,
        updatedAt: new Date()
    };

    const updatedProduct: Product | null = await productRepository.updateProductById(productId, updatedProductData, tx);
    return updatedProduct ? formatProduct(updatedProduct) : null;
}

export const deleteProductById = async (productId: string, tx?: unknown): Promise<void> => {
    await productRepository.deleteProductById(productId, tx);
}

export const getProductStockInfoById = async (
    productId: string,
    tx?: unknown
): Promise<ProductStockInfo | null> => {
    return await productRepository.getProductStockInfoById(productId, tx);
};

export const updateProductQuantity = async (
    productId: string,
    quantity: string,
    tx?: unknown
): Promise<void> => {
    await productRepository.updateProductQuantity(productId, quantity, tx);
};