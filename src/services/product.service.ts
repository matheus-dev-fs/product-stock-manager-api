import { NewProduct, Product } from "../db/schema";
import { PublicCategory } from "../types/categories/public-category.type";
import * as productRepository from "../repositories/product.repository";
import * as categoryService from "./category.service";
import { PublicProduct } from "../types/products/public-product.type";
import { formatProduct } from "../helpers/products.helper";
import { AppError } from "../errors/app.error";
import { isMaxGteMin, isQuantityGteMin, isQuantityLteMax } from "../helpers/quantities.helper";
import { PublicProductWithDetails } from "../types/products/list-public-product-type";

export const createProduct = async (productData: NewProduct): Promise<PublicProduct> => {
    const isCategoryValid: PublicCategory | null = await categoryService.getCategoryById(productData.categoryId);

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

export const getProductByIdWithCategory = async (productId: string): Promise<PublicProductWithDetails | null> => {
    const product: PublicProductWithDetails | null = await productRepository.getProductByIdWithCategory(productId);
    return product;
};