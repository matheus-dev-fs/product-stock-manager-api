export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, DatabaseError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}