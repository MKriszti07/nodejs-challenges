const express = require('express');
const { logger } = require('./logger');

const app = express();
app.use(express.json());

// Request logging middleware (simple)
app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const ms = Date.now() - start;
        logger.info('request', {
            method: req.method,
            path: req.originalUrl,
            status: req.statusCode,
            durationMs: ms,
        });
    });

    next();
});

app.get('/', (req, res) => {
    throw new Error('Something went wrong!');
});

// Express error handler (must have 4 args)
app.use((err, req, res, next) => {
    logger.error('unhandled_error', {
        message: err.message,
        // winston.format.errors({ stack: true }) will capture stack if you pass the error too,
        // but including explicitly is fine:
        stack: err.stack,
        method: req.method,
        path: req.originalUrl,
    });

    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000, () => {
    logger.info("server_started", { port: 3000 });
    console.log("Listening on http://localhost:3000");
});