import { NewUser, User } from "../db/schema";
import { AppError } from "../errors/app.error";
import { formatUserResponse, hashPassword } from "../helpers/user.helpers";
import * as userRepository from "../repositories/user.repository";
import { UserWithoutPassword } from "../types/users/user-without-password.type";

export const createUser = async (data: NewUser): Promise<UserWithoutPassword> => {
    const existingUserResult: User | null = await userRepository.getUserByEmail(data.email);

    if (existingUserResult) {
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