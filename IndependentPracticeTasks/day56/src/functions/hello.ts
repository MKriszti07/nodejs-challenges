import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export async function hello(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const name = 
        request.query.get('name') ||
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

app.http('hello', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'hello',
    handler: hello
});