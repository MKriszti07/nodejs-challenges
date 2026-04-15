require('dotenv').config();

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_ISSUER = process.env.JWT_ISSUER || 'day66-demo';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'day66-api';
const JWT_ACCESS_TTL = process.env.JWT_ACCESS_TTL || '10m';
const REFRESH_TTL_DAYS = Number(process.env.REFRESH_TTL_DAYS) || 14;

function sha256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

function issueAccessToken({ userId }) {
    const jti = crypto.randomUUID();

    return jwt.sign(
        {},
        JWT_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: JWT_ACCESS_TTL,
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
            subject: String(userId),
            jwtid: jti
        }
    );
}

function verifyAccessToken(token) {
    return jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE
    });
}

function createRefreshTokenValue() {
    // random 256-bit token, base64url
    return crypto.randomBytes(32).toString('base64url');
}

function refreshExpiresAt() {
    const d = new Date();
    d.setDate(d.getDate() + REFRESH_TTL_DAYS);
    return d;
}

module.exports = {
    sha256,
    issueAccessToken,
    verifyAccessToken,
    createRefreshTokenValue,
    refreshExpiresAt
};