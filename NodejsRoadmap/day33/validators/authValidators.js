const { body } = require('express-validator');

const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

    body('email')
        .isEmail().withMessage('A valid email is required')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    body('age')
        .optional()
        .isInt({ min: 13 }).withMessage('Age must be a number and at least 13'),
];

module.exports = { registerValidation };