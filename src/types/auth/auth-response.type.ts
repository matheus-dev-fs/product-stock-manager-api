import { PublicUser } from "../users/public-user.type.js";

export type AuthResponse = {
    user: PublicUser;
    accessToken: string;
    refreshToken: string; 
};