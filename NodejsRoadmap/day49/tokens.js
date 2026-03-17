const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// For a practice project, hardcoding is fine.
// In real apps: use process.env.ACCESS_TOKEN_SECRET / REFRESH_TOKEN_SECRET
const ACCESS_TOKEN_SECRET = 'dev-access-secret-change-me';
const REFRESH_TOKEN_SECRET = 'dev-refresh-secret-change-me';

// Short access token, longer refresh token
const ACCESS_TOKEN_TTL = '15s';     // keep tiny to test refresh quickly
const REFRESH_TOKEN_TTL = '7d';

// In-memory allow-list of refresh tokens (rotation support)
// Map refreshToken -> { userId, jti, expiresAt }
const refreshStore = new Map();

function signAccessToken(user) {
    // Keep payload small
    return jwt.sign(
        { sub: user.id, username: user.username },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_TTL }
    );
}

function signRefreshToken(user) {
    const jti = crypto.randomUUID();
    const token = jwt.sign(
        { sub: user.id, jti },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_TTL }
    );

    // Track it so we can revoke/rotate
    // (jwt.decode doesn't verify, we just want exp to store)
    const decoded = jwt.decode(token);
    refreshStore.set(token, {
        userId: user.id,
        jti,
        expiresAt: decoded.exp * 1000,
    });

    return token;
}

function verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

function revokeRefreshToken(token) {
    refreshStore.delete(token);
}

function isRefreshTokenAllowed(token) {
    const entry = refreshStore.get(token);
    if (!entry) return false; 
    if (Date.now() > entry.expiresAt) {
        refreshStore.delete(token);
        return false;
    }
    return true;
}

// Express middleware: Authorization: Bearer <accessToken>
function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ error: "Missing Bearer token" });
    }

    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, username: payload.username };
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired access token" });
    }
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken,
    isRefreshTokenAllowed,
    requireAuth,
};
