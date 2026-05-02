import { RequestHandler } from "express";
import { createProductSchema, listProductsSchema, productIdParamSchema, updateProductSchema } from "../validators/product.validator";
import * as productService from "../services/product.service";
import { PublicProduct } from "../types/products/public-product.type";
import { PublicProductWithDetails } from "../types/products/public-product-with-details.type";
import { AppError } from "../errors/app.error";

export const createProduct: RequestHandler = async (req, res): Promise<void> => {
    const createProductData = createProductSchema.parse(req.body); 
    const createdProduct: PublicProduct = await productService.createProduct(createProductData);
    res.status(201).json({ error: null, data: createdProduct });
};

export const listProducts: RequestHandler = async (req, res): Promise<void> => {
    const { offset, limit, search } = listProductsSchema.parse(req.query);
    const products: PublicProductWithDetails[] = await productService.listProducts(offset, limit, search);
    res.status(200).json({ error: null, data: products });
};

export const getProductWithDetailsById: RequestHandler = async (req, res): Promise<void> => {
    const { id } = productIdParamSchema.parse(req.params);
    const product: PublicProductWithDetails | null = await productService.getProductWithDetailsById(id);

    if (!product) {
        throw new AppError(404, 'Produto não encontrado');
    }

    res.status(200).json({ error: null, data: product });
};

export const updateProductById: RequestHandler = async (req, res): Promise<void> => {
    const { id } = productIdParamSchema.parse(req.params);
    const updateProductData = updateProductSchema.parse(req.body);
    const updatedProduct: PublicProduct | null = await productService.updateProductById(id, updateProductData);

    if (!updatedProduct) {
        throw new AppError(404, 'Produto não encontrado');
    }

    res.status(200).json({ error: null, data: updatedProduct });
}

export const deleteProductById: RequestHandler = async (req, res): Promise<void> => {
    const { id } = productIdParamSchema.parse(req.params);
    await productService.deleteProductById(id);
    res.status(204).json({ error: null, data: null });
};