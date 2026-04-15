require('dotenv').config();

const express = require('express');
const crypto = require('crypto');
const { prisma } = require('./prismaClient');

const { authRequired } = require('./auth/authMiddleware');
const {
    sha256,
    issueAccessToken,
    createRefreshTokenValue,
    refreshExpiresAt
} = require('./auth/tokens');

const app = express();
app.use(express.json());

// Helpers for refresh token in cookie (recommended for browsers)
// For simple practice you can also send it in JSON.
function setRefreshCookie(res, refreshToken) {
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: false, // set true behind HTTPS
        samSite: 'lax',
        path: '/refresh'
    });
}

function clearRefreshCookie(res) {
    res.clearCookie('refresh_token', { path: '/refresh' });
}

app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'Day 66 JWT best practices (access + refresh rotation)',
        routes: ['/login', '/refresh', '/logout', '/me']
    });
});

/**
 * POST /login
 * body: { email, password }
 */
app.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required '});

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
        // practice only. In real apps: hash passwords + constant-time compare
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = issueAccessToken({ userId: user.id });

    const refreshToken = createRefreshTokenValue();
    const refreshHash = sha256(refreshToken);

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            tokenHash: refreshHash,
            expiresAt: refreshExpiresAt()
        }
    });

    // If you want cookie-based:
    // res.cookie requeires cookie-parser; for practice we return JSON instead.
    res.json({
        accessToken,
        refreshToken,
        tokenType: 'Bearer'
    });
});

/**
 * POST /refresh
 * body: { refreshToken }
 *
 * Rotation rules:
 * - refreshToken must exist, not revoked, not expired
 * - revoke old token, create new token, return new pair
 */

app.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

    const oldHash = sha256(refreshToken);

    const stored = await prisma.refreshToken.findUnique({ 
        where: { tokenHash: oldHash },
        include: { user: true }
    });

    if (!stored) return res.status(401).json({ error: 'Invalid refresh token' });
    if (stored.revokedAt) return res.status(401).json({ error: 'Refresh token revoked' });
    if (stored.expiresAt.getTime() <= Date.now()) return res.status(401).json({ error: 'Refresh token expired' });

    const newRefreshToken = createRefreshTokenValue();
    const newHash = sha256(newRefreshToken);

    // Transaction: revoke old + insert new
    await prisma.$transaction([
        prisma.refreshToken.update({
            where: { tokenHash: oldHash },
            data: {
                revokedAt: new Date(),
                replacedBy: newHash
            }
        }),
        prisma.refreshToken.create({
            data: {
                userId: stored.userId,
                tokenHash: newHash,
                expiresAt: refreshExpiresAt()
            }
        })
    ]);

    const accessToken = issueAccessToken({ userId: stored.userId });

    res.json({
        accessToken,
        refreshToken: newRefreshToken,
        tokenType: 'Bearer'
    });
});

/**
 * POST /logout
 * body: { refreshToken }
 *
 * Revokes the refresh token so it can’t be used again.
 */
app.post('/logout', async (req, res) => {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

    const hash = sha256(refreshToken);

    // revoke if exists and not already revoked
    await prisma.refreshToken.updateMany({
        where: { tokenHash: hash, revokedAt: null },
        data: { revokedAt: new Date() }
    });

    res.json({ ok: true });
});

app.get('/me', authRequired, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, createdAt: true }
    });

    res.json({ ok: true, user });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`http://localhost:${port}`));


//Login
// curl -s -X POST http://localhost:3000/login \
//   -H "content-type: application/json" \
//   -d '{"email":"alice@example.com","password":"password123"}'

//Use access token
// curl -H "Authorization: Bearer <ACCESS>" http://localhost:3000/me

//Refresh token
// curl -s -X POST http://localhost:3000/refresh \
//   -H "content-type: application/json" \
//   -d '{"refreshToken":"<REFRESH>"}'

//Logout
// curl -s -X POST http://localhost:3000/logout \
//   -H "content-type: application/json" \
//   -d '{"refreshToken":"<LATEST_REFRESH>"}'