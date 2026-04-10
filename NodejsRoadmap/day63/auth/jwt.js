require("dotenv").config();

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// For practice only: keep secret in env in real deployments
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";

function issueToken(payload) {
  const jti = crypto.randomUUID();

  // Standard JWT claims:
  // - sub: subject (user id)
  // - jti: token id (used for blacklist)
  return jwt.sign(
    { ...payload },
    JWT_SECRET,
    {
        expiresIn: JWT_EXPIRES_IN,
        subject: String(payload.sub),
        jwtid: jti
    }
  );
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = { issueToken, verifyToken, JWT_SECRET };