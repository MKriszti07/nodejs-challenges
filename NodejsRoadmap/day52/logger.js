require('dotenv').config();

const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }), // include stack for Error objects
        winston.format.json()
    ),
    defaultMeta: { service: 'day52-winston-demo' },
    transports: [
        // Write all logs with level `error` and below to `day52/logs/error.log`
        new winston.transports.File({ filename: 'day52/logs/error.log', level: 'error' }),
        // Write all logs with level `info` and below to `day52/logs/combined.log`
        new winston.transports.File({ filename: 'day52/logs/combined.log' }),
    ],
});

// Also log to console in development (pretty print)
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

module.exports = { logger };