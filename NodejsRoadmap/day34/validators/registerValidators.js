const { body } = require('express-validator');

const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

module.exports = { registerValidation };