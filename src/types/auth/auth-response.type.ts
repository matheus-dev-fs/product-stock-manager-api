import { PublicUser } from "../users/public-user.type";

export type AuthResponse = {
    user: PublicUser;
    accessToken: string;
    refreshToken: string; 
};