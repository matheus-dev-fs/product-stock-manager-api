import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db/connection";
import { NewUser, User, users } from "../db/schema";
import { Result } from "../types/result/result.type";

export const createUser = async (data: NewUser): Promise<Result<User, string>> => {
    const result: User[] = await db.insert(users).values(data).returning();

    if (result.length === 0) {
        return {
            error: "Erro ao criar usuário",
            data: null
        };
    }

    return {
        error: null,
        data: result[0]
    };
};

export const getUserByEmail = async (email: string): Promise<Result<User, string>> => {
    const result: User[] = await db
        .select()
        .from(users)
        .where(
            and(
                eq(users.email, email),
                isNull(users.deletedAt) // Correção aqui
            )
        )
        .limit(1);
    
    if (result.length === 0) {
        return {
            error: "Usuário não encontrado",
            data: null
        };
    }

    return {
        error: null,
        data: result[0]
    };
};