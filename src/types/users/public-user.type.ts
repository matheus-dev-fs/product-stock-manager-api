import { User } from "../../db/schema/index.js";

export type PublicUser = Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'>;