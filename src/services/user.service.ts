import { NewUser, User } from "../db/schema";
import { AppError } from "../errors/app.error";
import { formatUserResponse, hashPassword } from "../helpers/user.helpers";
import * as userRepository from "../repositories/user.repository";
import * as fileService from "./file.service";
import { PublicUser } from "../types/users/public-user.type";

export const createUser = async (data: NewUser, tx?: unknown): Promise<PublicUser> => {
    const isEmailInUse: boolean = await userRepository.isEmailInUse(data.email, tx);

    if (isEmailInUse) {
        throw new AppError(400, 'Email já está em uso');
    }
    
    const hashedPassword: string = await hashPassword(data.password);
    
    const newUser: NewUser = {
        ...data,
        password: hashedPassword
    };

    const createdUser: User = await userRepository.createUser(newUser, tx);
    
    return formatUserResponse(createdUser);
}

export const getUserByEmail = async (email: string, tx?: unknown): Promise<User | null> => {
    const user: User | null = await userRepository.getUserByEmail(email, tx);
    return user;
};

export const getUserById = async (id: string, tx?: unknown): Promise<User | null> => {
    const user: User | null = await userRepository.getUserById(id, tx);
    return user;
}

export const getPublicUserById = async (id: string, tx?: unknown): Promise<PublicUser | null> => {
    const user: User | null = await userRepository.getUserById(id, tx);

    if (!user) {
        return null;
    }

    return formatUserResponse(user);
}

export const listPublicUsers = async (offset: number, limit: number, tx?: unknown): Promise<PublicUser[]> => {
    const users: User[] = await userRepository.listUsers(offset, limit, tx);
    return users.map(formatUserResponse);
}

export const deleteUserById = async (id: string, tx?: unknown): Promise<void> => {
    await userRepository.deleteUserById(id, tx);
}

export const updateUserById = async (id: string, data: Partial<NewUser>, tx?: unknown): Promise<PublicUser | null> => {
    const userToBeUpdated: User | null = await userRepository.getUserById(id, tx);

    if (!userToBeUpdated) {
        return null;
    }

    if (data.email && data.email !== userToBeUpdated.email) {
        const isEmailInUse: boolean = await userRepository.isEmailInUse(data.email, tx);

        if (isEmailInUse) {
            throw new AppError(400, 'Email já está em uso');
        }
    }

    const updatedUserData: Partial<User> = {
        ...data,
        password: data.password ? await hashPassword(data.password) : undefined,
        updatedAt: new Date()
    };

    if (data.avatar && userToBeUpdated.avatar && data.avatar !== userToBeUpdated.avatar) {
        await fileService.deleteAvatar(userToBeUpdated.avatar);
    }

    const updatedUser: User | null = await userRepository.updateUserById(id, updatedUserData, tx);

    if (!updatedUser) {
        return null;
    }

    return formatUserResponse(updatedUser);
};