import { User } from "../../db/schema";

export type UserWithoutPassword = Omit<User, 'password'>;