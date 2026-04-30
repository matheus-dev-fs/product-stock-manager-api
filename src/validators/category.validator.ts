import z from 'zod';

export const categoryNameSchema = z.object({
    name: z.string('O nome deve ser uma string')
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(255, 'Nome deve ter no máximo 255 caracteres')
}, "Um objeto com a propriedade 'name' é esperado");

export const listCategoriesQuerySchema = z.object({
    includeProductCount: z.coerce.boolean().optional().default(false)
}, "Um objeto de query string é esperado, com a propriedade 'includeProductCount' opcional do tipo booleano");