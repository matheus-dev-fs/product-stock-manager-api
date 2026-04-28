import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { NewRefreshToken, RefreshToken, refreshTokens } from "../db/schema/refresh-token";
import { DatabaseError } from "../errors/database.error";

export const createRefreshToken = async (userId: string, token: string): Promise<RefreshToken> => {
    const newRefreshToken: NewRefreshToken = {
        userId,
        token
    };

    const [createdToken]: RefreshToken[] = await db.insert(refreshTokens).values(newRefreshToken).returning();

    if (!createdToken) {
        throw new DatabaseError('Erro ao criar refresh token');
    }

    return createdToken;
}

export const findRefreshToken = async (token: string): Promise<RefreshToken | null> => {
    const refreshToken: RefreshToken[]= await db
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
    await db
        .delete(refreshTokens)
        .where(eq(
            refreshTokens.token, 
            token
        ));
}