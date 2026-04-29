import { RequestHandler } from "express";
import { loginUserSchema } from "../validators/user.validator";
import * as authService from "../services/auth.service";
import * as userService from "../services/user.service";
import { AuthResponse } from "../types/auth/auth-response.type";
import { refreshTokenSchema } from "../validators/refresh-token.validator";
import { AppError } from "../errors/app.error";
import { PublicUser } from "../types/users/public-user.type";
import { TokenPayload } from "../interfaces/token-payload.interface";

export const login: RequestHandler = async (req, res): Promise<void> => {
    const loginData = loginUserSchema.parse(req.body);
    const loginResponse: AuthResponse = await authService.login(loginData.email, loginData.password);
    res.status(200).json({ error: null, data: loginResponse });
};

export const logout: RequestHandler = async (req, res): Promise<void> => {
    const refreshTokenData = refreshTokenSchema.parse(req.body);
    await authService.logout(refreshTokenData.refreshToken);
    res.status(200).json({ error: null, data: { message: 'Logout realizado com sucesso' } });
}

export const refreshTokens: RequestHandler = async (req, res): Promise<void> => {
    const refreshTokenData = refreshTokenSchema.parse(req.body);
    const loginResponse: AuthResponse = await authService.refreshTokens(refreshTokenData.refreshToken);
    res.status(200).json({ error: null, data: loginResponse });
}

export const getMe: RequestHandler = async (req, res): Promise<void> => {
    const me: TokenPayload | undefined = req.user;

    if (!me) {
        throw new AppError(401, 'Usuário não autenticado');
    }

    const user: PublicUser | null = await userService.getPublicUserById(me.id);

    if (!user) {
        throw new AppError(404, 'Usuário não encontrado');
    }

    res.status(200).json({ error: null, data: user });
};
