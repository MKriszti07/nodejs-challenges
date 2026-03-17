const express = require('express');
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken,
    isRefreshTokenAllowed,
} = require('./tokens');

const authRouter = express.Router();

// Fake users (replace with DB lookup later)
const USERS = [
  { id: "1", username: "admin", password: "admin" },
  { id: "2", username: "user", password: "user" },
];

// Helper for cookie options
function refreshCookieOptions() {
    return {
        httpOnly: true,
        sameSite: 'lax',
        // secure: true, // enable in production (https)
        path: '/auth/refresh',
    };
}

// POST /auth/login { username, password }
authRouter.post('/login', (req,res) => {
    const { username, password} = req.body || {};
    const user = USERS.find((u) => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions());
    res.json({ accessToken });
});

// POST /auth/refresh
// Reads refresh token from cookie, verifies it, checks allow-list, ROTATES it
authRouter.post('/refresh', (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "Missing refresh token cookie" });

    try {
        // Verify signature + exp
        const payload = verifyRefreshToken(token);

        // Check allow-list (rotation/revocation)
        if (!isRefreshTokenAllowed(token)) {
            return res.status(401).json({ error: "Refresh token revoked or unknown" });
        }

        // Rotate: revoke old refresh token and mint a new one
        revokeRefreshToken(token);

        const user = USERS.find((u) => u.id === payload.sub);
        if (!user) return res.status(401).json({ error: "User not found" });

        const newAccessToken = signAccessToken(user);
        const newRefreshToken = signRefreshToken(user);

        res.cookie('refreshToken', newRefreshToken, refreshCookieOptions());
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
});

// POST /auth/logout
authRouter.post('/logout', (req, res) => {
    const token = req.cookies.refreshToken;
    if (token) revokeRefreshToken(token);

    res.clearCookie('refreshToken', { path: '/auth/refresh' });
    res.json({ ok: true });
});

module.exports = { authRouter };