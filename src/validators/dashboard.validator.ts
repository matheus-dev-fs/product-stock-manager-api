import z from 'zod';

export const dateRangeSchema = z.object({
    startDate: z.string('A data de início é obrigatória')
        .refine((date: string): boolean => !isNaN(Date.parse(date)), {
            message: "Tipo de dado inválido para a data de início. Deve ser uma string no formato ISO 8601 (YYYY-MM-DD)."
        })
        .optional(),
    endDate: z.string('A data de término é obrigatória')
        .refine((date: string): boolean => !isNaN(Date.parse(date)), {
            message: "Tipo de dado inválido para a data de término. Deve ser uma string no formato ISO 8601 (YYYY-MM-DD)."
        })
        .optional()
});

export type DateRange = z.infer<typeof dateRangeSchema>;