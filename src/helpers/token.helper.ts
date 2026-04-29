import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from '../interfaces/token-payload.interface';
import crypto from 'crypto';

export const generateAccessToken = (payload: TokenPayload): string => {
    const secret = process.env.JWT_SECRET as string;
    
    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN as typeof options.expiresIn) || '15m'
    };

    return jwt.sign(payload, secret, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
    const secret = process.env.JWT_SECRET as string;
    
    const decoded = jwt.verify(token, secret) as JwtPayload;

    return {
        id: decoded.id as unknown as string,
        email: decoded.email,
        isAdmin: decoded.isAdmin as unknown as boolean
    };
};

export const generateRefreshToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

export const parseBearerToken = (authHeader: string): string | null => {
    const [scheme, token]: string[] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return null;
    }

    return token;
};