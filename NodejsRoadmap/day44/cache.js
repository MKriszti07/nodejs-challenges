// Very simple in-memory cache: { key: { value, expiresAt } }
const cacheStore = new Map();

/**
 * Set value in cache with TTL (milliseconds)
 */
function setCache(key, value, ttlMs) {
    const expiresAt = Date.now() + ttlMs;
    cacheStore.set(key, { value, expiresAt });
}

/**
 * Get value from cache or null if missing/expired
 */
function getCache(key) {
    const entry = cacheStore.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
        cacheStore.delete(key);
        return null;
    }

    return entry.value;
}

/**
 * Simple middleware factory for caching responses
 * keyBuilder: (req) => string
 * ttlMs: time-to-live in ms
 */
function cachedMiddleware(keyBuilder, ttlMs) {
    return (req, res, next) => {
        const key = keyBuilder(req);
        const cached = getCache(key);

        if (cached) {
            return res.json({
                success: true,
                cached: true,
                data: cached,
            });
        }

        // Monkey-patch res.json to store the response data
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            // Only cache successful responses with .data
            if (body && body.success && body.data !== undefined) {
                setCache(key, body.data, ttlMs);
            }
            return originalJson(body);
        };

        next();
    };
}

module.exports = {
    setCache,
    getCache,
    cachedMiddleware,
};
