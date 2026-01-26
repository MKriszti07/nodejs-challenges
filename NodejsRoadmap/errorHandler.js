/**
 * errorHandler.js
 * * Demonstrates global error handling in Express.
 */

require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;

// --- 1. Routes ---

app.get('/', (req, res) => {
    res.send('<h1>Welcome!</h1><p>Try visiting /broken or a random URL.</p>');
});

app.get('/broken', (req, res, next) => {
    // We simulate an error
    const err = new Error('Something went wrong in the database!');
    err.status = 500;

    // Crucial: In Express, you pass errors to the handler using next(err)
    next(err);
});

// --- 2. 404 Handler (The "Catch-all") ---
// If the request doesn't match any route above, it lands here.
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err); // Pass the 404 error to the actual error handler
});

// --- 3. The Global Error Handler ---
// This MUST be the last middleware in your app.use() stack.
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    console.error(`[ERROR] ${statusCode}: ${err.message}`);

    // Insightful tip: In production, don't leak the stack trace to the user!
    res.status(statusCode).json({
        error: {
            message: err.message,
            status: statusCode,
            // Show stack trace only if we are NOT in production
            stack: err.stack
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// http://localhost:3000/some-random-page
// http://localhost:3000/broken