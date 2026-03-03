require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const { findUserByEmail } = require('./data/users');
const { createToken, getCookieOptions } = require('./utils/authUtils');
const { requireAuth } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// Public route
app.get('/public', (req, res) => {
    res.json({
        success: true,
        message: 'This is a public endpoint',
    });
});

// Login: issue JWT in httpOnly cookie
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    }

    // Create token with minimal info
    const token = createToken({
        id: user.id,
        email: user.email,
        name: user.name
    });

    // Set cookie
    res.cookie('token', token, getCookieOptions());

    res.json({
        success: true,
        message: 'Logged in successfully',
    });
});

// Get current user (protected)
app.get('/auth/me', requireAuth, (req, res) => {
    res.json({
        success: true,
        user: req.user, // set by requireAuth
    });
});

// Logout: clear cookie
app.post('auth/logout', (req, res) => {
    res.clearCookie('token', getCookieOptions());
    res.json({
        success: true,
        message: 'Logged out successfully',
    });
});

// Basic home
app.get('/', (req, res) => {
    res.send(`
    <h1>Day 43: JWT + Cookies Demo</h1>
    <p>Try these endpoints with a REST client:</p>
    <ul>
      <li>POST /auth/login { "email": "user@example.com", "password": "password123" }</li>
      <li>GET /auth/me</li>
      <li>POST /auth/logout</li>
      <li>GET /public</li>
    </ul>
  `);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Login
// curl -i -X POST http://localhost:3000/auth/login \
//   -H "Content-Type: application/json" \
//   -c cookies.txt \
//   -d '{"email":"user@example.com","password":"password123"}'

// curl -i http://localhost:3000/auth/me -b cookies.txt

// curl -i -X POST http://localhost:3000/auth/logout -b cookies.txt