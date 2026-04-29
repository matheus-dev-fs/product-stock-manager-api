import { RequestHandler } from "express";
import { createUserSchema, listUsersSchema } from "../validators/user.validator";
import { PublicUser } from "../types/users/public-user.type";
import *  as userService from "../services/user.service";

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