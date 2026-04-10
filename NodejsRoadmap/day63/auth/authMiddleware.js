const { verifyToken } = require('./jwt');

function getBearerToken(req) {
    const h = req.get('authorization') || '';
    const m = h.match(/^Bearer\s+(.+)$/i);
    return m ? m[1].trim() : null;
}

function createAuthMiddleware({ redis }) {
    if (!redis) throw new Error('redis client required');

    return async function auth(req, res, next) {
        try {
            const token = getBearerToken(req);
            if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

            const decoded = verifyToken(token);

            // decoded has `jti` and `exp` (seconds since epoch)
            const jti = decoded.jti;
            if (!jti) return res.status(401).json({ error: 'Token missing jti' });

            const revokedKey = `revoked:${jti}`;
            const isRevoked = await redis.exists(revokedKey);
            if (isRevoked) return res.status(401).json({ error: 'Token revoked' });

            req.user = {
                sub: decoded.sub,
                jti: decoded.jti
            };

            next();
        } catch (e) {
            return res.status(401).json({ error: 'Invalid token', details: e.message });
        }
    };
}

module.exports = { createAuthMiddleware, getBearerToken };