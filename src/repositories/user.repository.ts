import { and, eq, isNull } from "drizzle-orm";
import { db as database } from "../db/connection.js";
import { NewUser, User, users } from "../db/schema/index.js";
import { DatabaseError } from "../errors/database.error.js";

export const createUser = async (data: NewUser): Promise<User> => {
    const result: User[] = await database.insert(users).values(data).returning();

    if (result.length === 0) {
        throw new DatabaseError("Erro ao criar usuário");
    }

    const user: User = result[0];
    return user;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const result: User[] = await database
        .select()
        .from(users)
        .where(
            and(
                eq(users.email, email),
                isNull(users.deletedAt)
            )
        )
        .limit(1);

    if (result.length === 0) {
        return null;
    }

    return result[0];
};

export const isEmailInUse = async (email: string): Promise<boolean> => {
    const result: User[] = await database
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    return result.length > 0;
}

export const getUserById = async (id: string): Promise<User | null> => {
    const result: User[] = await database
        .select()
        .from(users)
        .where(
            and(
                eq(users.id, id),
                isNull(users.deletedAt)
            )
        )
        .limit(1);

    if (result.length === 0) {
        return null;
    }

    return result[0];
}

export const listUsers = async (offset: number, limit: number): Promise<User[]> => {
    const result: User[] = await database
        .select()
        .from(users)
        .where(isNull(users.deletedAt))
        .offset(offset)
        .limit(limit);

    return result;
}

export const deleteUserById = async (id: string): Promise<void> => {
    await database
        .update(users)
        .set({ deletedAt: new Date() })
        .where(
            and(
                eq(users.id, id), 
                isNull(users.deletedAt)
            )
        );
};

export const updateUserById = async (id: string, data: Partial<NewUser>): Promise<User | null> => {
    const result: User[] = await database
        .update(users)
        .set(data)
        .where(and(eq(users.id, id), isNull(users.deletedAt)))
        .returning();

    if (result.length === 0) {
        return null;
    }

    const user: User = result[0];
    return user;
}