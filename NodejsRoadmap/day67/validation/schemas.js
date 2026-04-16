const Joi = require('joi');

const createUserBody = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(50).required(),
    age: Joi.number().integer().min(13).max(120).required()
});

const listUsersQuery = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(50).default(10),
    sort: Joi.string().valid('createdAt', 'name').default('createdAt')
});

const userIdParams = Joi.object({
    id: Joi.number().integer().min(1).required()
});

module.exports = { createUserBody, listUsersQuery, userIdParams };