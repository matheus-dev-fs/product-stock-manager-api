import { RefreshToken } from "../db/schema/refresh-token";
import { generateRefreshToken } from "../helpers/token.helper";
import * as refreshTokenRepository from "../repositories/refresh-token.repository";

export const createRefreshToken = async (userId: string): Promise<RefreshToken> => {
    const refreshToken: string = generateRefreshToken()
    return await refreshTokenRepository.createRefreshToken(userId, refreshToken);
}

export const findRefreshToken = async (token: string): Promise<RefreshToken | null> => {
    return await refreshTokenRepository.findRefreshToken(token);
}

export const deleteRefreshToken = async (token: string): Promise<void> => {
    await refreshTokenRepository.deleteRefreshToken(token);
}