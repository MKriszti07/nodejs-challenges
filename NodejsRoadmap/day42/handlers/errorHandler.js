// Global error-handling middleware
function errorHandler(err, req, res, next) {
    // Default values
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    // Basic logging
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
    });

    // In a real app you might hide stack traces in production
    res.status(statusCode).json({
        success: false,
        status,
        message: err.message || 'Something went wrong',
        // Only include stack in development
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack
        }),
    });
}

module.exports = errorHandler;