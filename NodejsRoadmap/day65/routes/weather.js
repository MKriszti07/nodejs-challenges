const express = require('express');
const { getWeather } = require('../externalApi');

const router = express.Router();

router.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: 'city is required' });

    try {
        const data = await getWeather(city);
        res.json({ ok: true, data });
    } catch (e) {
        res.status(502).json({ ok: false, error: 'Upstream API failed' });
    }
});

module.exports = { router };