import { NewUser, User } from "../db/schema";
import { formatUserResponse, hashPassword } from "../helpers/user.helpers";
import * as userRepository from "../repositories/user.repository";
import { Result } from "../types/result/result.type";
import { UserWithoutPassword } from "../types/users/user-without-password.type";

export const createUser = async (data: NewUser): Promise<UserWithoutPassword> => {
    const existingUserResult: Result<User, string> = await userRepository.getUserByEmail(data.email);

    if (existingUserResult.data) {
        throw new Error("Email já está em uso");
    }

    const hashedPassword: string = await hashPassword(data.password);
    
    const newUser: NewUser = {
        ...data,
        password: hashedPassword
    };

    const createdUserResult: Result<User, string> = await userRepository.createUser(newUser);
    
    if (createdUserResult.error != null) {
        throw new Error(createdUserResult.error);
    }

    const user: User = createdUserResult.data;
    return formatUserResponse(user);
}

export const getUserByEmail = async (email: string): Promise<Result<User, string>> => {
    const user: Result<User, string> = await userRepository.getUserByEmail(email);
    return user;
};