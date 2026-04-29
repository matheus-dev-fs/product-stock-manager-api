import { User } from "../../db/schema";

export type PublicUser = Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'>;