import { RequestHandler } from "express";
import { createProductSchema } from "../validators/product.validator";
import * as productService from "../services/product.service";
import { PublicProduct } from "../types/products/public-product.type";

export const createProduct: RequestHandler = async (req, res): Promise<void> => {
    const createProductData = createProductSchema.parse(req.body); 
    const createdProduct: PublicProduct = await productService.createProduct(createProductData);
    res.status(201).json({ error: null, data: createdProduct });
};