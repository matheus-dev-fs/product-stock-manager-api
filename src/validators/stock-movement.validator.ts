import z from 'zod';

export const createStockMovementSchema = z.object({
    productId: z.uuid('ID do produto deve ser um UUID válido'),
    type: z.enum(['IN', 'OUT'], 'Tipo de movimento deve ser IN ou OUT'),
    quantity: z.coerce.number().min(1, 'Quantidade deve ser um número positivo').transform(String),
}, 'Dados inválidos para criação do movimento de estoque. Deve conter productId, type e quantity');