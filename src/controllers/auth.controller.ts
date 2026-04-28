import { RequestHandler } from "express";
import { loginUserSchema } from "../validators/user.validator";
import * as authService from "../services/auth.service";
import { LoginResponse } from "../types/auth/login-response.type";

export const login: RequestHandler = async (req, res): Promise<void> => {
    const loginData = loginUserSchema.parse(req.body);
    const loginResponse: LoginResponse = await authService.login(loginData.email, loginData.password);
    res.status(200).json({ error: null, data: loginResponse });
};
