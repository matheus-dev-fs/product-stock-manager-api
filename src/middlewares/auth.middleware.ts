import type { Response, NextFunction, Request } from 'express';
import { AppError } from '../errors/app.error.js';
import { parseBearerToken, verifyAccessToken } from '../helpers/token.helper.js';
import { TokenPayload } from '../interfaces/token-payload.interface.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers['authorization'];
    
    if (!authHeader) {
        throw new AppError(401, "O token de autenticação é obrigatório.");
    }

    const token: string | null = parseBearerToken(authHeader);

    if (!token) {
        throw new AppError(401, "O token de autenticação é inválido.");
    }

    const decodedPayload: TokenPayload = verifyAccessToken(token);

    req.user = decodedPayload;
    next();
};