require('dotenv').config();

const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');

const { requestId } = require('./middlewares/requestId');
const { cacheControl } = require('./middlewares/cacheControl');

const app = express();

// 1) Disable x-powered-by (tiny win + security)
app.disable('x-powered-by');

// 2) Security headers (not speed, but “prod ready”)
app.use(helmet());

// 3) Compress responses (major bandwidth win)
// Note: compression costs CPU; usually worth it for JSON/html
app.use(compression());

// 4) Add request id (useful when measuring)
app.use(requestId);

// 5) Prefer a lightweight logger (and skip in production if you want)
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// 6) Static assets with long cache
app.use(
    '/',
    cacheControl(60 * 60 * 24 * 30), // 30 days
    express.static('public', { etag: true, lastModified: true })
);

// 7) Only parse JSON where needed (don’t do app.use(express.json()) globally)
// Example: parse JSON only for /api routes
app.use('/api', express.json({ limit: '100kb' }));

// ---- Demo endpoints ----

// A lightweight endpoint
app.get('/api/ping', (req, res) => {
    res.json({ ok: true, requestId: req.requestId, time: Date.now() });
});

// BAD: CPU-heavy work on the event loop (blocks other requests)
app.get('/api/slow', (req, res) => {
    const start = Date.now();
    // simulate CPU work
    let x = 0;
    for (let i = 0; i < 80_000_000; i++) x += i;
    res.json({ ok: true, ms: Date.now() - start, x });
});

// BETTER (conceptual): do less work, cache results, move CPU work off process
// Here we just cache a computed value to show the pattern.
let cached = null;
let cachedAt = 0;

app.get('/api/fast', (req, res) => {
    const now = Date.now();

    // cache for 10 seconds
    if (!cached || now - cachedAt > 10_000) {
        const start = Date.now();
        let x = 0;
        for (let i = 0; i < 80_000_000; i++) x += i;
        cached = { x, computedMs: Date.now() - start };
        cachedAt = now;
    }

    res.setHeader('Cache-Control', 'public, max-age=10');
    res.json({ ok: true, cachedAt, ...cached });
});

// Basic in-memory rate limit to protect the server (per IP)
// (For real apps use Redis like Day 57)
const hits = new Map();
app.use('/api', (req, res, next) => {
    const ip = req.iő || 'unknown';
    const windowMs = 10_000;
    const max = 30;

    const now = Date.now();
    const entry = hits.get(ip) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
        entry.count = 0;
        entry.resetAt = now + windowMs;
    }

    entry.count++;
    hits.set(ip, entry);

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)));

    if (entry.count > max) {
        res.setHeader('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
        return res.status(429).json({ error: 'Too Many Requests' });
    }

    next();
});

// Error handler (avoid expensive stack traces in prod responses)
app.use((err, req, res, next) => {
    console.error(`[${req.requestId}]`, err);
    res.status(500).json({ error: 'Internal Server Error', requestId: req.requestId });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}`);
});

//npm i -g autocannon

//npm i
//npm run dev

// autocannon -c 50 -d 10 http://localhost:3000/api/ping
// autocannon -c 10 -d 10 http://localhost:3000/api/slow
// autocannon -c 10 -d 10 http://localhost:3000/api/fast