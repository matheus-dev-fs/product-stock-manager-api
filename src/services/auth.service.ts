import { User } from "../db/schema";
import { AppError } from "../errors/app.error";
import { generateAccessToken } from "../helpers/token.helper";
import { comparePassword, formatUserResponse } from "../helpers/user.helpers";
import { LoginResponse } from "../types/auth/login-response.type";
import { UserWithoutPassword } from "../types/users/user-without-password.type";
import * as userService from "./user.service";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
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

    return {
        user: userResponse,
        accessToken
    }
};