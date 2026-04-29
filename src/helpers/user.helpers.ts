import bcrypt from "bcrypt";
import { User } from "../db/schema";
import { PublicUser } from "../types/users/public-user.type";

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const formatUserResponse = (user: User): PublicUser => {
    const { password, createdAt, updatedAt, deletedAt, ...PublicUser } = user;

    if (PublicUser.avatar) {
        PublicUser.avatar = `${process.env.BASE_URL}/public/avatars/${PublicUser.avatar}`;
    }

    return PublicUser;
};