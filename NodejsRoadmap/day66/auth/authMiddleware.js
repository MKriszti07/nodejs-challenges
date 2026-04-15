const { verifyAccessToken } = require('./tokens');

function getBearer(req) {
    const h = req.get('authorization' || '');
    const m = h.match(/^Bearer\s+(.+)$/i);
    return m ? m[1].trim() : null;
}

function authRequired(req, res, next) {
    const token = getBearer(req);
    if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

    try {
        const decoded = verifyAccessToken(token);
        req.user = { id: Number(decoded.sub), jti: decoded.jti };
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Invalid token', details: e.message });
    }
}

module.exports = { authRequired };