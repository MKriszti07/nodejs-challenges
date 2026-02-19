const { param } = require('express-validator');

const userIdParamValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('User id must be a positive integer'),
];

module.exports = { userIdParamValidation };