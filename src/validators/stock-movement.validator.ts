import z from 'zod';

export const createStockMovementSchema = z.object({
    productId: z.uuid('ID do produto deve ser um UUID válido'),
    type: z.enum(['IN', 'OUT'], 'Tipo de movimento deve ser IN ou OUT'),
    quantity: z.coerce.number().min(1, 'Quantidade deve ser um número positivo').transform(String),
}, 'Dados inválidos para criação do movimento de estoque. Deve conter productId, type e quantity');

export const listStockMovementsSchema = z.object({
    offset: z.coerce.number('O offset deve ser um número')
        .int('O offset deve ser um número inteiro')
        .min(0, 'O offset deve ser um número inteiro positivo')
        .default(0),
    limit: z.coerce.number('O limit deve ser um número')
        .int('O limit deve ser um número inteiro')
        .min(1, 'O limit deve ser um número inteiro positivo')
        .max(100, 'O limit deve ser no máximo 100')
        .default(10),
    productId: z.uuid('ID do produto deve ser um UUID válido').optional(),
}, "Dados de listagem de movimentos de estoque inválidos. Deve conter os seguintes campos: offset (número inteiro positivo), limit (número inteiro positivo, máximo 100)");

export type ListStockMovementsInput = z.infer<typeof listStockMovementsSchema>;