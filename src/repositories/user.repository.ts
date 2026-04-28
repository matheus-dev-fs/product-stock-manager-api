import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db/connection";
import { NewUser, User, users } from "../db/schema";
import { DatabaseError } from "../errors/database.error";

export const createUser = async (data: NewUser): Promise<User> => {
    const result: User[] = await db.insert(users).values(data).returning();

    if (result.length === 0) {
        throw new DatabaseError("Erro ao criar usuário");
    }

    const user: User = result[0];
    return user;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
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
        return null;
    }

    return result[0];
};

export const getUserById = async (id: string): Promise<User | null> => {
    const result: User[] = await db
        .select()
        .from(users)
        .where(
            and(
                eq(users.id, id),
                isNull(users.deletedAt) // Correção aqui
            )
        )
        .limit(1);
    
    if (result.length === 0) {
        return null;
    }

    return result[0];
}