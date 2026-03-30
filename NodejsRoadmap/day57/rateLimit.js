const DEFAULTS = {
  windowSeconds: 60, // per minute
  max: 10, // max requests per window
  keyPrefix: "rl",
};

// Simple fixed-window rate limit using Redis INCR + EXPIRE
// Good for practice; for production consider sliding window or token bucket w/ Lua.
function createRateLimiter({ redis, windowSeconds, max, keyPrefix } = {}) {
  if (!redis) throw new Error("redis client is required");

  const opts = {
    ...DEFAULTS,
    windowsSeconds: windowSeconds ?? DEFAULTS.windowSeconds,
    max: max ?? DEFAULTS.max,
    keyPrefix: keyPrefix ?? DEFAULTS.keyPrefix,
  };

  return async function rateLimit(req, res, next) {
    try {
      // Use IP (or user id if authenticated)
      const ip = req.ip || req.connection?.remoteAddress || "unknown";
      const key = `${opts.keyPrefix}:${ip}`;

      // INCR increments and returns the current count
      const current = await redis.incr(key);

      // Set expiration only when the key is first created
      if (current === 1) {
        await redis.expire(key, opts.windowSeconds);
      }

      const ttl = await redis.ttl(key); // seconds remaining

      res.setHeader("X-RateLimit-Limit", String(opts.max));
      res.setHeader(
        "X-RateLimit-Remaining",
        String(Math.max(0, opts.max - current)),
      );
      res.setHeader(
        "X-RateLimit-Reset",
        String(Date.now() + Math.max(0, ttl) * 1000),
      ); // timestamp when limit resets

      if (current > opts.max) {
        res.setHeader("Retry-After", String(Math.max(1, ttl)));
        return res.status(429).json({
          error: "Too Many Requests",
          limit: opts.max,
          windowSeconds: opts.windowSeconds,
          retryAfterSeconds: Math.max(1, ttl),
        });
      }

      next();
    } catch (err) {
      // If Redis is down, you can choose fail-open or fail-closed.
      // For practice, fail-open so your app still works:
      console.error('Rate limiter error:', err);
      next();
    }
  };
}

module.exports = { createRateLimiter };