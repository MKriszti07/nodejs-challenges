/**
 * middlewareExample.js
 * * Demonstrates custom, route-specific, and error-handling middleware in Express.
 */

const express = require('express');
const app = express();
const PORT = 3000;

// --- 1. Application-level Middleware (Logger) ---
// This runs for every single request that hits the server.
const loggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request to: ${req.url}`);

    // Crucial: Call next() to pass control to the next middleware/route
    next();
};

app.use(loggerMiddleware);

// --- 2. Built-in Middleware ---
// Allows Express to parse JSON data in the body of incoming requests
app.use(express.json());

// --- 3. Route-specific Middleware (Auth Simulation) ---
// This middleware only runs if the user hits the /profile route.
const checkAuth = (req, res, next) => {
    const isAdmin = req.query.admin === 'true';

    if (isAdmin) {
        console.log('Admin access granted.');
        next();
    } else {
        console.log('Access denied.');
        res.status(403).send('<h1>403 Forbidden</h1><p>You need admin privileges to see this.</p>');
    }
};

// --- Routes ---

app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1><p>The logger middleware already recorded this visit!</p>');
});

// Using the checkAuth middleware specifically for this route
app.get('/profile', checkAuth, (req, res) => {
    res.send('<h1>Admin Profile</h1><p>Welcome, Admin! This is sensitive data.</p>');
});

// A route to trigger an error for testing
app.get('/error', (req, res) => {
    throw new Error('Something went wrong on the server!');
});

// --- 4. Error-handling Middleware ---
// Note: Error-handling middleware ALWAYS takes FOUR arguments (err, req, res, next)
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).send('<h1>500 Internal Server Error</h1><p>Oops! Something broke.</p>');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log('Test Logger: Visit any page.');
    console.log('Test Auth: Visit /profile?admin=true');
    console.log('Test Error: Visit /error');
});

// Visit http://localhost:3000/. Check your terminal. You will see the timestamp, method, and URL logged there.
// Visit http://localhost:3000/profile. You will get a 403 Forbidden error.
// Visit http://localhost:3000/profile?admin=true. You will see the Admin Profile page.
// Visit http://localhost:3000/error. Instead of the app crashing, the error middleware catches the throw and sends a professional 500 error page.
