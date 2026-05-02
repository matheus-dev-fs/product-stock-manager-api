import { RefreshToken } from "../db/schema/refresh-token";
import { generateRefreshToken } from "../helpers/token.helper";
import * as refreshTokenRepository from "../repositories/refresh-token.repository";

export const createRefreshToken = async (userId: string, tx?: unknown): Promise<RefreshToken> => {
    const refreshToken: string = generateRefreshToken()
    return await refreshTokenRepository.createRefreshToken(userId, refreshToken, tx);
}

export const findRefreshToken = async (token: string, tx?: unknown): Promise<RefreshToken | null> => {
    return await refreshTokenRepository.findRefreshToken(token, tx);
}

export const deleteRefreshToken = async (token: string, tx?: unknown): Promise<void> => {
    await refreshTokenRepository.deleteRefreshToken(token, tx);
}