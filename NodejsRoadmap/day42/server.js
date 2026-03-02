require('dotenv').config();

const express = require('express');
const AppError = require('./errors/appError');
const asyncHandler = require('./handlers/asyncHandler');
const errorHandler = require('./handlers/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Demo route: OK
app.get('/ok', (req, res) => {
    res.json({ success: true, message: 'Everything is fine!' });
});

// Demo route: synchronous error
app.get('/sync-error', (req, res, next) => {
    // Throw a regular error
    throw new Error('Synchronous route error');
});

// Demo route: async error
app.get('/async-error', asyncHandler(async (req, res) => {
    // Simulate async failing
    await new Promise((_, reject) => 
        setTimeout(() => 
            reject(new Error('Async error occurred')), 100));
    res.json({ success: true }); // never reached
}));

// Demo route: custom AppError
app.get('/not-allowed', (req, res, next) => {
    return next(new AppError('You are not allowed to access this resource', 403));
});

// 404 handler for unmatched routes
app.use((req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler (must be after all routes/middleware)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// http://localhost:3000/ok
// http://localhost:3000/sync-error
// http://localhost:3000/async-error
// http://localhost:3000/not-allowed
// http://localhost:3000/anything-else