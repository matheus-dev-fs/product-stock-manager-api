import bcrypt from "bcrypt";
import { User } from "../db/schema";
import { UserWithoutPassword } from "../types/users/user-without-password.type";

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const formatUserResponse = (user: User): UserWithoutPassword => {
    const { password, ...userWithoutPassword } = user;

    if (userWithoutPassword.avatar) {
        userWithoutPassword.avatar = `${process.env.BASE_URL}/static/avatars/${userWithoutPassword.avatar}`;
    }

    return userWithoutPassword;
};