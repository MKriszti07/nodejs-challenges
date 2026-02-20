const { validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((e) => ({
                field: e.param,
                message: e.msg,
            })),
        });
    }
    next();
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({
        success: false,
        message: 'Not authenticated',
    });
}

module.exports = { handleValidationErrors, ensureAuthenticated };
