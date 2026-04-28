import bcrypt from "bcrypt";
import { User } from "../db/schema";
import { UserWithoutPassword } from "../types/users/user-without-password.type";

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hashSync(password, 10);
};

export const formatUserResponse = (user: User): UserWithoutPassword => {
    const { password, ...userWithoutPassword } = user;
    console.log("User before formatting:", user);
    console.log("User without password:", userWithoutPassword);
    console.log("password", password);

    if (userWithoutPassword.avatar) {
        userWithoutPassword.avatar = `${process.env.BASE_URL}/static/avatars/${userWithoutPassword.avatar}`;
    }

    return userWithoutPassword;
};