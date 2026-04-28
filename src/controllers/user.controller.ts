import { RequestHandler } from "express";
import { createUserSchema } from "../validators/user.validator";
import { UserWithoutPassword } from "../types/users/user-without-password.type";
import *  as userService from "../services/user.service";

export const createUser: RequestHandler = async (req, res): Promise<void> => {
    const userData = createUserSchema.parse(req.body);
    const user: UserWithoutPassword = await userService.createUser(userData);
    res.status(201).json({ error: null, data: user });
};