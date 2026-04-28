import { User } from "../db/schema";
import { RefreshToken } from "../db/schema/refresh-token";
import { AppError } from "../errors/app.error";
import { generateAccessToken } from "../helpers/token.helper";
import { comparePassword, formatUserResponse } from "../helpers/user.helpers";
import { AuthResponse } from "../types/auth/auth-response.type";
import { UserWithoutPassword } from "../types/users/user-without-password.type";
import * as userService from "./user.service";
import * as refreshTokenService from "./refresh-token.service";

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const existingUser: User | null = await userService.getUserByEmail(email);

    if (!existingUser) {
        throw new AppError(401, 'Credenciais inválidas');
    }

    const isPasswordMatch: boolean = await comparePassword(password, existingUser.password);

    if (!isPasswordMatch) {
        throw new AppError(401, 'Credenciais inválidas');
    }

    const userResponse: UserWithoutPassword = formatUserResponse(existingUser);
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

    const userResponse: UserWithoutPassword = formatUserResponse(user);
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