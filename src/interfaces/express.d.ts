import { TokenPayload } from './token-payload.interface';

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}