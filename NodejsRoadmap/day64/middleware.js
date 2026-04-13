function withMiddlewares(resolver, middlewares = []) {
    return middlewares.reduceRight((next, mw) => {
        return (parent, args, ctx, info) =>
            mw({
                parent,
                args,
                ctx,
                info,
                // Preserve resolver parameters when middleware calls next() without args.
                next: (
                    nextParent = parent,
                    nextArgs = args,
                    nextCtx = ctx,
                    nextInfo = info,
                ) => next(nextParent, nextArgs, nextCtx, nextInfo),
            });
    }, resolver);
}

// --- Middleware examples ---

async function requireAuth({ ctx, next }) {
    if (!ctx.user) {
        const err = new Error('Unauthorized');
        err.code = 'UNAUTHORIZED';
        throw err;
    }
    return next();
}

async function timing({ ctx, info, next }) {
    const start = Date.now();
    try {
        return await next();
    } finally {
        const ms = Date.now() - start;
        const field = `${info.parentType.name}.${info.fieldName}`;
        ctx.metrics.push({ field, ms });
    }
}

async function logResolver({ ctx, info, args, next }) {
    const field = `${info.parentType.name}.${info.fieldName}`;
    ctx.logs.push({ field, args });
    return next();
}

module.exports = { withMiddlewares, requireAuth, timing, logResolver };