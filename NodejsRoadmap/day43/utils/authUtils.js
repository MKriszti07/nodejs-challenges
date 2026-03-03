const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Create JWT
function createToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT
function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

// Cookie options
function getCookieOptions() {
    const isProd = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure: isProd,         // true in prod (HTTPS), false in dev
        sameSite: 'lax',        // good default for same-site apps
        maxAge: 60 * 60 * 1000, // 1 hour in ms (match JWT if you like)
    };
}

module.exports = { createToken, verifyToken, getCookieOptions };
