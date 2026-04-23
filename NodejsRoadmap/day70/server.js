import express from 'express';
import { createRouter } from './src/routes.js';

const app = express();

app.disable('x-powered-by');

// Basic request logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
});

app.use(createRouter());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
    console.log(`SSR app listening on http://localhost:${PORT}`);
});