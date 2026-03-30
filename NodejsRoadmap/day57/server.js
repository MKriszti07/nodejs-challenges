require("dotenv").config();

const express = require("express");
const { createClient } = require("redis");
const { createRateLimiter } = require("./rateLimit");

async function main() {
  const app = express();

  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const redis = createClient({ url: redisUrl });

  redis.on("error", (err) => console.error("Redis Client Error", err));
  await redis.connect();

  // Apply rate limiting to all routes
  app.use(
    createRateLimiter({
      redis,
      windowSeconds: 60,
      max: 10,
      keyPrefix: "day57",
    }),
  );

  app.get("/", (req, res) => {
    res.json({
      ok: true,
      message: "Day 57: Rate limiting with Redis",
      ip: req.ip,
      time: new Date().toISOString(),
    });
  });

  app.get('/heavy', async (req, res) => {
    // fake expensive endpoint
    await new Promise((r) => setTimeout(r, 200));
    res.json({ ok: true, endpoint: '/heavy' });
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
    console.log(`Redis: ${redisUrl}`);
    console.log("Try: for i in {1..15}; do curl -i http://localhost:3000/ | head -n 1; done");
  });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

// Terminal 1 (start Redis)

// bash
// docker compose up -d
// Terminal 2 (start API)

// bash
// npm i
// npm start
// Test rate limit

// bash
// for i in {1..15}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/; done
