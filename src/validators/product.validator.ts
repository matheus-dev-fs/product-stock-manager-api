import z from "zod";
import { isMaxGteMin } from "../helpers/quantities.helper";

export const createProductSchema = z.object({
    name: z.string('O nome do produto deve ser uma string')
        .min(2, 'O nome do produto deve ter pelo menos 2 caracteres')
        .max(255, 'O nome do produto deve ter no máximo 255 caracteres'),
    categoryId: z.uuid('O ID da categoria deve ser um UUID válido'),
    unitPrice: z.number('O preço unitário deve ser um número inteiro')
        .int('O preço unitário deve ser um número inteiro')
        .min(0, 'O preço unitário deve ser um número inteiro positivo'),
    unityType: z.enum(['kg', 'g', 'l', 'ml', 'un'], 'O tipo de unidade deve ser um dos seguintes: kg, g, l, ml, un')
        .optional()
        .default('un'),
    quantity: z.coerce.number('A quantidade deve ser um número')
        .min(0, 'A quantidade deve ser um número positivo')
        .default(0)
        .transform(String),
    minimumQuantity: z.coerce.number('A quantidade mínima deve ser um número')
        .min(0, 'A quantidade mínima deve ser um número positivo')
        .default(0)
        .transform(String),
    maximumQuantity: z.coerce.number('A quantidade máxima deve ser um número')
        .min(0, 'A quantidade máxima deve ser um número positivo')
        .default(0)
        .transform(String),
}, "Dados de criação de produto inválidos. Deve conter os seguintes campos: name (string, 2-255 caracteres), categoryId (UUID), unitPrice (inteiro positivo), unityType (kg, g, l, ml, un), quantity (número positivo), minimumQuantity (número positivo), maximumQuantity (número positivo)")
    .refine((data): boolean => isMaxGteMin(data.minimumQuantity, data.maximumQuantity), {
        message: 'A quantidade máxima deve ser maior ou igual à quantidade mínima',
        path: ['maximumQuantity'],
    });


export const listProductsSchema = z.object({
    offset: z.coerce.number('O offset deve ser um número')
        .int('O offset deve ser um número inteiro')
        .min(0, 'O offset deve ser um número inteiro positivo')
        .default(0),
    limit: z.coerce.number('O limit deve ser um número')
        .int('O limit deve ser um número inteiro')
        .min(1, 'O limit deve ser um número inteiro positivo')
        .max(100, 'O limit deve ser no máximo 100')
        .default(10),
    search: z.string('O termo de busca deve ser uma string')
        .min(2, 'O termo de busca deve ter pelo menos 2 caracteres')
        .max(255, 'O termo de busca deve ter no máximo 255 caracteres')
        .optional(),
}, "Dados de listagem de produtos inválidos. Deve conter os seguintes campos: offset (número inteiro positivo), limit (número inteiro positivo, máximo 100)");

export const productIdParamSchema = z.object({
    id: z.uuid('O ID do produto deve ser um UUID válido'),
}, "Parâmetro de ID de produto inválido. Deve conter o seguinte campo: id (UUID)");

export const updateProductSchema = z.object({
    name: z.string('O nome do produto deve ser uma string')
        .min(2, 'O nome do produto deve ter pelo menos 2 caracteres')
        .max(255, 'O nome do produto deve ter no máximo 255 caracteres')
        .optional(),
    categoryId: z.uuid('O ID da categoria deve ser um UUID válido')
        .optional(),
    unitPrice: z.number('O preço unitário deve ser um número inteiro')
        .int('O preço unitário deve ser um número inteiro')
        .min(0, 'O preço unitário deve ser um número inteiro positivo')
        .optional(),
    unityType: z.enum(['kg', 'g', 'l', 'ml', 'un'], 'O tipo de unidade deve ser um dos seguintes: kg, g, l, ml, un')
        .default('un')
        .optional(),
    quantity: z.coerce.number('A quantidade deve ser um número')
        .min(0, 'A quantidade deve ser um número positivo')
        .transform(String)
        .optional(),
    minimumQuantity: z.coerce.number('A quantidade mínima deve ser um número')
        .min(0, 'A quantidade mínima deve ser um número positivo')
        .transform(String)
        .optional(),
    maximumQuantity: z.coerce.number('A quantidade máxima deve ser um número')
        .min(0, 'A quantidade máxima deve ser um número positivo')
        .transform(String)
        .optional(),
}, "Dados de criação de produto inválidos. Deve conter os seguintes campos: name (string, 2-255 caracteres), categoryId (UUID), unitPrice (inteiro positivo), unityType (kg, g, l, ml, un), quantity (número positivo), minimumQuantity (número positivo), maximumQuantity (número positivo)")
    .refine((data): boolean => isMaxGteMin(data.minimumQuantity, data.maximumQuantity), {
        message: 'A quantidade máxima deve ser maior ou igual à quantidade mínima',
        path: ['maximumQuantity'],
    });