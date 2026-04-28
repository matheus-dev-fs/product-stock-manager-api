import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { DatabaseError } from '../errors/database.error';
import { AppError } from '../errors/app.error';

export const globalErrorHandler = (
    err: Error & { status?: number, type?: string }, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
        res.status(400).json({ error: 'JSON malformado ou inválido', data: null });
        return;
    }

    if (err instanceof ZodError) {
        const errorMessage: string = err.issues.map(issue => issue.message).join(', ');
        res.status(400).json({ error: errorMessage, data: null });
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message, data: null });
        return;
    }

    if (err instanceof DatabaseError) {
        console.error(`[Database Error] ${err.name}: ${err.message}`, err.stack);
        
        res.status(500).json({ error: 'Erro interno no banco de dados', data: null });
        return;
    }

    console.error('[Unhandled Error]', err);
    res.status(500).json({ error: 'Erro interno do servidor', data: null });
};