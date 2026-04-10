require("dotenv").config();

const express = require("express");
const { createClient } = require("redis");

const { issueToken, verifyToken } = require("./auth/jwt");
const {
  createAuthMiddleware,
  getBearerToken,
} = require("./auth/authMiddleware");

async function main() {
  const app = express();
  app.use(express.json());

  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const redis = createClient({ url: redisUrl });
  redis.on("error", (err) => console.error("Redis error", err));
  await redis.connect();

  const auth = createAuthMiddleware({ redis });

  // Practice login: accepts { userId }
  app.post("/login", (req, res) => {
    const userId = req.body?.userId;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const token = issueToken({ sub: String(userId) });

    res.json({ token });
  });

  // Protected route
  app.get("/me", auth, (req, res) => {
    res.json({ ok: true, user: req.user });
  });

  // Logout: revoke current token
  app.post("/logout", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ error: "Missing Bearer token" });

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const jti = decoded.jti;
    const exp = decoded.exp; // seconds since epoch
    const now = Math.floor(Date.now() / 1000);

    const ttlSeconds = Math.max(1, exp - now);
    await redis.set(`revoked:${jti}`, "1", { EX: ttlSeconds });

    res.json({ ok: true, revoked: true, ttlSeconds });
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API: http://localhost:${port}`);
    console.log(`Redis: ${redisUrl}`);
  });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});


//docker compose up -d

// npm i
// npm start

//TOKEN=$(curl -s -X POST http://localhost:3000/login -H "content-type: application/json" -d '{"userId":"123"}' | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).token")
// echo "$TOKEN"

//curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/me

//curl -X POST -H "Authorization: Bearer $TOKEN" http://localhost:3000/logout

//curl -i -H "Authorization: Bearer $TOKEN" http://localhost:3000/me