import { RequestHandler } from "express";
import { createProductSchema, listProductsSchema } from "../validators/product.validator";
import * as productService from "../services/product.service";
import { PublicProduct } from "../types/products/public-product.type";
import { ListPublicProducts } from "../types/products/list-public-product-type";

export const createProduct: RequestHandler = async (req, res): Promise<void> => {
    const createProductData = createProductSchema.parse(req.body); 
    const createdProduct: PublicProduct = await productService.createProduct(createProductData);
    res.status(201).json({ error: null, data: createdProduct });
};

export const listProducts: RequestHandler = async (req, res): Promise<void> => {
    const { offset, limit, search } = listProductsSchema.parse(req.query);
    const products: ListPublicProducts = await productService.listProducts(offset, limit, search);
    res.status(200).json({ error: null, data: products });
};