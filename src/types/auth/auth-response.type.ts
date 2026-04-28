import { UserWithoutPassword } from "../users/user-without-password.type";

export type AuthResponse = {
    user: UserWithoutPassword;
    accessToken: string;
    refreshToken: string; 
};