import { TokenPayload } from './token-payload.interface.js';

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}