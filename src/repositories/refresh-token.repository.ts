import { eq } from "drizzle-orm";
import { db as database } from "../db/connection.js";
import { type NewRefreshToken, type RefreshToken, refreshTokens } from "../db/schema/refresh-token.js";
import { DatabaseError } from "../errors/database.error.js";

export const createRefreshToken = async (userId: string, token: string): Promise<RefreshToken> => {
    const newRefreshToken: NewRefreshToken = {
        userId,
        token
    };

    const [createdToken]: RefreshToken[] = await database.insert(refreshTokens).values(newRefreshToken).returning();

    if (!createdToken) {
        throw new DatabaseError('Erro ao criar refresh token');
    }

    return createdToken;
}

export const findRefreshToken = async (token: string): Promise<RefreshToken | null> => {
    const refreshToken: RefreshToken[]= await database
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

export const deleteRefreshToken = async (token: string): Promise<void> => {
    await database
        .delete(refreshTokens)
        .where(eq(
            refreshTokens.token, 
            token
        ));
}