import { RefreshToken } from "../db/schema/refresh-token.js";
import { generateRefreshToken } from "../helpers/token.helper.js";
import * as refreshTokenRepository from "../repositories/refresh-token.repository.js";

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