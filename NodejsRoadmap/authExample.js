/**
 * authExample.js
 * * Demonstrates JWT generation and verification using a middleware.
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

app.use(express.json());

// In a real app, this would be in a .env file!
const SECRET_KEY = 'your_super_secret_key_123';

// 1. Mock User Data
const user = {
    id: 1,
    username: 'node_master',
    email: 'node@example.com'
};

// 2. Login Route - Generates a JWT
app.post('/login', (req, res) => {
    // In a real app, you would verify req.body.username and password against a DB
    const { username, password } = req.body;

    if (username === 'node_master' && password === 'password123') {
        // Create the token (Payload, Secret Key, Options)
        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        return res.json({
            message: "Login successful!",
            token: token
        });
    }

    res.status(401).json({ message: "Invalid credentials" });
});

// 3. Authentication Middleware
// This function checks if the request has a valid token
const authenticateToken = (req, res, next) => {
    // Tokens are usually sent as "Bearer <TOKEN>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided. Access Denied." });
    }

    // Verify the token
    jwt.verify(token, SECRET_KEY, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }

        // Attach the decoded user data to the request object
        req.user = decodedUser;
        next();
    });
};

// 4. Protected Route - Requires a valid JWT
app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({
        message: `Welcome to your private dashboard, ${req.user.username}!`,
        secretData: "The password for the safe is: 42"
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Auth server running at http://localhost:${PORT}`);
});

// curl -X POST http://localhost:3000/login \
//      -H "Content-Type: application/json" \
//      -d '{"username": "node_master", "password": "password123"}'

// curl -X GET http://localhost:3000/dashboard \
//      -H "Authorization: Bearer <PASTE_TOKEN_HERE>"