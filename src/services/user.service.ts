import { NewUser, User } from "../db/schema";
import { AppError } from "../errors/app.error";
import { formatUserResponse, hashPassword } from "../helpers/user.helpers";
import * as userRepository from "../repositories/user.repository";
import * as fileService from "./file.service";
import { PublicUser } from "../types/users/public-user.type";

export const createUser = async (data: NewUser): Promise<PublicUser> => {
    const isEmailInUse: boolean = await userRepository.isEmailInUse(data.email);

    if (isEmailInUse) {
        throw new AppError(400, 'Email já está em uso');
    }
    
    const hashedPassword: string = await hashPassword(data.password);
    
    const newUser: NewUser = {
        ...data,
        password: hashedPassword
    };

    const createdUser: User = await userRepository.createUser(newUser);
    
    return formatUserResponse(createdUser);
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const user: User | null = await userRepository.getUserByEmail(email);
    return user;
};

export const getUserById = async (id: string): Promise<User | null> => {
    const user: User | null = await userRepository.getUserById(id);
    return user;
}

export const getPublicUserById = async (id: string): Promise<PublicUser | null> => {
    const user: User | null = await userRepository.getUserById(id);

    if (!user) {
        return null;
    }

    return formatUserResponse(user);
}

export const listPublicUsers = async (offset: number, limit: number): Promise<PublicUser[]> => {
    const users: User[] = await userRepository.listUsers(offset, limit);
    return users.map(formatUserResponse);
}

export const deleteUserById = async (id: string): Promise<void> => {
    await userRepository.deleteUserById(id);
}

export const updateUserById = async (id: string, data: Partial<NewUser>): Promise<PublicUser | null> => {
    const userToBeUpdated: User | null = await userRepository.getUserById(id);

    if (!userToBeUpdated) {
        return null;
    }

    if (data.email && data.email !== userToBeUpdated.email) {
        const isEmailInUse: boolean = await userRepository.isEmailInUse(data.email);

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

    const updatedUser: User | null = await userRepository.updateUserById(id, updatedUserData);

    if (!updatedUser) {
        return null;
    }

    return formatUserResponse(updatedUser);
};