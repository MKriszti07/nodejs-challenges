const { GraphQLError } = require('graphql');

function badRequest(message, code = 'BAD_REQUEST', details) {
    return new GraphQLError(message, {
        extensions: {
            code,
            details,
            http: { status: 400 }
        }
    });
}

function unauthorized(message = 'Unauthorized') {
    return new GraphQLError(message, {
        extensions: {
            code: 'UNAUTHORIZED',
            http: { status: 401 }
        }
    });
}

function forbidden(message = 'Forbidden') {
    return new GraphQLError(message, {
        extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 }
        }
    });
}

function notFound(message = 'Not found') {
    return new GraphQLError(message, {
        extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 }
        }
    });
}

module.exports = { badRequest, unauthorized, forbidden, notFound };