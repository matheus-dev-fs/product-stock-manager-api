import { RequestHandler } from "express";
import { loginUserSchema } from "../validators/user.validator";
import * as authService from "../services/auth.service";
import { AuthResponse } from "../types/auth/auth-response.type";
import { refreshTokenSchema } from "../validators/refresh-token.validator";

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
