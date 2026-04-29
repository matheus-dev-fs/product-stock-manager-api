import { z } from "zod";

export const loginUserSchema = z.object({
    email: z.string('Email deve ser uma string')
        .email("O email deve ser válido"),
    password: z.string('Senha deve ser uma string')
        .min(6, "A senha deve conter no mínimo 6 caracteres")
});
