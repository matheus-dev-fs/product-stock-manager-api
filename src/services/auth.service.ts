import { User } from "../db/schema/index.js";
import { RefreshToken } from "../db/schema/refresh-token.js";
import { AppError } from "../errors/app.error.js";
import { generateAccessToken } from "../helpers/token.helper.js";
import { comparePassword, formatUserResponse } from "../helpers/user.helpers.js";
import { AuthResponse } from "../types/auth/auth-response.type.js";
import { PublicUser } from "../types/users/public-user.type.js";
import * as userService from "./user.service.js";
import * as refreshTokenService from "./refresh-token.service.js";

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const existingUser: User | null = await userService.getUserByEmail(email);

    if (!existingUser) {
        throw new AppError(401, 'Credenciais inválidas');
    }

    const isPasswordMatch: boolean = await comparePassword(password, existingUser.password);

    if (!isPasswordMatch) {
        throw new AppError(401, 'Credenciais inválidas');
    }

    const userResponse: PublicUser = formatUserResponse(existingUser);
    const accessToken: string = generateAccessToken({ 
        id: existingUser.id, 
        email: existingUser.email, 
        isAdmin: existingUser.isAdmin 
    });
    const refreshToken: RefreshToken = await refreshTokenService.createRefreshToken(existingUser.id);

    return {
        user: userResponse,
        accessToken,
        refreshToken: refreshToken.token
    }
};

export const logout = async (refreshToken: string): Promise<void> => {
    await refreshTokenService.deleteRefreshToken(refreshToken);
}

export const refreshTokens = async (refreshToken: string): Promise<AuthResponse> => {
    const existingToken: RefreshToken | null = await refreshTokenService.findRefreshToken(refreshToken);

    if (!existingToken) {
        throw new AppError(401, 'Refresh token inválido');
    }

    if (existingToken.expiresAt < new Date()) {
        await refreshTokenService.deleteRefreshToken(refreshToken);
        throw new AppError(401, 'Refresh token expirado');
    }

    const user: User | null = await userService.getUserById(existingToken.userId);

    if (!user) {
        throw new AppError(401, 'Usuário associado ao refresh token não encontrado');
    }

    const userResponse: PublicUser = formatUserResponse(user);
    const accessToken: string = generateAccessToken({ 
        id: user.id, 
        email: user.email, 
        isAdmin: user.isAdmin 
    });

    return {
        user: userResponse,
        accessToken,
        refreshToken: existingToken.token
    }
}