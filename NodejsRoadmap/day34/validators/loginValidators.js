const { body } = require('express-validator');

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

module.exports = { loginValidation };