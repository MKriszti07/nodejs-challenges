require('dotenv').config();

const express = require('express');
const { cachedMiddleware } = require('./cache');

const app = express();
const PORT = process.env.PORT || 4000;

// Simulated slow data source
async function fetchExpensiveData() {
    // e.g. DB query, external API, heavy computation
    await new Promise((resolve) =>
        setTimeout(resolve, 2000)); // 2s delay

    return {
        timestamp: new Date().toISOString(),
        value: Math.random(),
    };
}

// Cache key based on route + query (here just route)
const cacheKeyBuilder = (req) => `expensive:/stats`;

// GET /stats with caching (e.g. cache for 30 seconds)
app.get('/stats', cachedMiddleware(cacheKeyBuilder, 30 * 1000), async (req, res, next) => {
    try {
        const data = await fetchExpensiveData();
        res.json({
            success: true,
            cached: false,
            data,
        });
    } catch (error) {
        next(error);
    }
});

app.get('/', (req, res) => {
    res.send('Caching demo. Try GET /stats multiple times.');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// # First call (takes ~2 seconds, cached: false)
// curl http://localhost:3000/stats

// # Immediately call again (should be instant, cached: true)
// curl http://localhost:3000/stats

// # Wait >30 seconds and call again (recomputed, cached: false again)
// sleep 35
// curl http://localhost:3000/stats