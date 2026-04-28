export class AppError extends Error {

    constructor(
        public statusCode: number = 400, 
        public message: string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}