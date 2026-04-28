import { UserWithoutPassword } from "../users/user-without-password.type";

export type LoginResponse = {
    user: UserWithoutPassword;
    accessToken: string;
};