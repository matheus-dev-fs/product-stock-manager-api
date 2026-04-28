import z from 'zod';

export const refreshTokenSchema = z.object({
    refreshToken: z.string("O refreshToken deve ser uma string").length(64, 'O refreshToken fornecido é inválido') 
});