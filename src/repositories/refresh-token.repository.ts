import { eq } from "drizzle-orm";
import { db as database } from "../db/connection";
import { type NewRefreshToken, type RefreshToken, refreshTokens } from "../db/schema/refresh-token";
import { DatabaseError } from "../errors/database.error";

type DbClient = typeof database;

export const createRefreshToken = async (userId: string, token: string, tx?: unknown): Promise<RefreshToken> => {
    const client: DbClient = (tx ?? database) as DbClient;
    const newRefreshToken: NewRefreshToken = {
        userId,
        token
    };

    const [createdToken]: RefreshToken[] = await client.insert(refreshTokens).values(newRefreshToken).returning();

    if (!createdToken) {
        throw new DatabaseError('Erro ao criar refresh token');
    }

    return createdToken;
}

export const findRefreshToken = async (token: string, tx?: unknown): Promise<RefreshToken | null> => {
    const client: DbClient = (tx ?? database) as DbClient;
    const refreshToken: RefreshToken[]= await client
        .select()
        .from(refreshTokens)
        .where(eq(
            refreshTokens.token, 
            token
        ))
        .limit(1);
    
    if (refreshToken.length === 0) {
        return null;
    }

    return refreshToken[0];
}

export const deleteRefreshToken = async (token: string, tx?: unknown): Promise<void> => {
    const client: DbClient = (tx ?? database) as DbClient;
    await client
        .delete(refreshTokens)
        .where(eq(
            refreshTokens.token, 
            token
        ));
}