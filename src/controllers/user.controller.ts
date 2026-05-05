import { RequestHandler } from "express";
import { createUserSchema, userByIdSchema, listUsersSchema, updateUserSchema } from "../validators/user.validator.js";
import { PublicUser } from "../types/users/public-user.type.js";
import *  as userService from "../services/user.service.js";
import * as fileService from "../services/file.service.js";
import { AppError } from "../errors/app.error.js";

export const createUser: RequestHandler = async (req, res): Promise<void> => {
    const userData = createUserSchema.parse(req.body);
    const user: PublicUser = await userService.createUser(userData);
    res.status(201).json({ error: null, data: user });
};

export const listPublicUsers: RequestHandler = async (req, res): Promise<void> => {
    const { offset, limit } = listUsersSchema.parse(req.query);
    const users: PublicUser[] = await userService.listPublicUsers(offset, limit);
    res.status(200).json({ error: null, data: users });
};

export const getPublicUserById: RequestHandler = async (req, res): Promise<void> => {
    const { id } = userByIdSchema.parse(req.params);
    const user: PublicUser | null = await userService.getPublicUserById(id);

    if (!user) {
        throw new AppError(404, 'Usuário não encontrado');
    }

    res.status(200).json({ error: null, data: user });
};

export const deleteUserById: RequestHandler = async (req, res): Promise<void> => {
    const { id } = userByIdSchema.parse(req.params);
    await userService.deleteUserById(id);
    res.status(200).json({ error: null, data: null });
};

export const updateUserById: RequestHandler = async (req, res): Promise<void> => {
    const { id } = userByIdSchema.parse(req.params);
    const updateUserData = updateUserSchema.parse(req.body);

    let avatarFilename: string | undefined;

    if (req.file) {
        avatarFilename = await fileService.saveAvatar(req.file.buffer, req.file.originalname);
    }

    const updatedData = {
         ...updateUserData, 
         avatar: avatarFilename ?? undefined 
    };

    const updatedUser: PublicUser | null = await userService.updateUserById(id, updatedData);
    
    if (!updatedUser) {
        throw new AppError(404, 'Usuário não encontrado');
    }

    res.status(200).json({ error: null, data: updatedUser });
};