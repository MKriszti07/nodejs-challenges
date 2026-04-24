"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = hello;
const functions_1 = require("@azure/functions");
async function hello(request, context) {
    const name = request.query.get('name') ||
        (await request.text()).trim() || // supports sending plain text body
        'World';
    context.log('HTTP trigger function processed a request.', { name });
    return {
        status: 200,
        jsonBody: {
            ok: true,
            message: `Hello, ${name}!`,
            method: request.method,
            time: new Date().toISOString()
        }
    };
}
functions_1.app.http('hello', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'hello',
    handler: hello
});
