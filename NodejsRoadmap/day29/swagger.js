const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'A simple Express API for managing users with Swagger documentation',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['name', 'email'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'The auto-generated id of the user',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            description: 'The name of the user',
                            example: 'John Doe'
                        },
                        email: {
                            type: 'string',
                            description: 'The email of the user',
                            example: 'john@example.com'
                        },
                        age: {
                            type: 'integer',
                            description: 'The age of the user',
                            example: 30
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message'
                        }
                    }
                }
            }
        }
    },
    apis: [path.join(__dirname, 'routes', '*.js')] // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;