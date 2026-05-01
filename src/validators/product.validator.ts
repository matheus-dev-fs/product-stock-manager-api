import z from "zod";
import { isMaxGteMin, isQuantityGteMin, isQuantityLteMax } from "../helpers/quantities.helper";

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
    })
    .refine((data): boolean => isQuantityGteMin(data.quantity, data.minimumQuantity), {
        message: 'A quantidade do produto não pode ser menor que a quantidade mínima',
        path: ['quantity'],
    })
    .refine((data): boolean => isQuantityLteMax(data.quantity, data.maximumQuantity), {
        message: 'A quantidade do produto não pode ser maior que a quantidade máxima',
        path: ['quantity'],
    });