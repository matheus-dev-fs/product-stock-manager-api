import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { DatabaseError } from '../errors/database.error';
import { AppError } from '../errors/app.error';
import { $ZodIssue } from 'zod/v4/core';
import { logger } from '../lib/logger';

export const globalErrorHandler = (
    err: Error & { status?: number, type?: string }, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({ error: 'Token de autenticação inválido.', data: null });
        return;
    }

    if (err.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'Token de autenticação expirado.', data: null });
        return;
    }

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
        res.status(400).json({ error: 'JSON malformado ou inválido', data: null });
        return;
    }

    if (err instanceof ZodError) {
        const errorMessage: string = err.issues.map((issue: $ZodIssue): string => issue.message).join(', ');
        res.status(400).json({ error: errorMessage, data: null });
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message, data: null });
        return;
    }

    if (err instanceof DatabaseError) {
        logger.error({ 
            err, 
            type: err.name, 
            path: req.originalUrl,
            method: req.method
        }, 'Erro interno no banco de dados');
        
        res.status(500).json({ error: 'Erro interno no banco de dados', data: null });
        return;
    }

    logger.error({ 
        err, 
        path: req.originalUrl,
        method: req.method 
    }, 'Erro interno do servidor não tratado');
    res.status(500).json({ error: 'Erro interno do servidor', data: null });
};