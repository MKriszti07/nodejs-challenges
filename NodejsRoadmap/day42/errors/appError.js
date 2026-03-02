class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // e.g. 'fail' for 4xx, 'error' for 5xx
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // mark as expected error

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;