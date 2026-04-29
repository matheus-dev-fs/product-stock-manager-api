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

export const listUsersSchema = z.object({
    offset: z.coerce.number('Offset deve ser um número')
        .int('O offset deve ser um número inteiro')
        .min(0, "O offset deve ser um número inteiro positivo")
        .optional()
        .default(0),
    limit: z.coerce.number('Limit deve ser um número')
        .int('O limit deve ser um número inteiro')
        .min(1, "O limit deve ser um número inteiro positivo")
        .optional()
        .default(10)
});

export const userByIdSchema = z.object({
    id: z.uuid('ID deve ser um UUID válido')
});

export const updateUserSchema = z.object({
    name: z.string('Nome deve ser uma string')
        .min(1, "O nome é obrigatório")
        .max(255, "O nome deve conter no máximo 255 caracteres.")
        .optional(),
    email: z.string('Email deve ser uma string')
        .email("O email deve ser válido")
        .optional(),
    password: z.string('Senha deve ser uma string')
        .min(6, "A senha deve conter no mínimo 6 caracteres")
        .optional(),
    avatar: z.string('Avatar deve ser uma string')
        .nullable()
        .optional()
})
