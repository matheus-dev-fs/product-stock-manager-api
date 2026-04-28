import z from "zod";

export const createUserSchema = z.object({
    name: z.string('Nome deve ser uma string')
        .min(1, "O nome é obrigatório")
        .max(255, "O nome deve conter no máximo 255 caracteres."),
    email: z.string('Email deve ser uma string')
        .email("O email deve ser válido"),
    password: z.string('Senha deve ser uma string')
        .min(6, "A senha deve conter no mínimo 6 caracteres")
});