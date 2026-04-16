function validate({ body, query, params } = {}) {
    return (req, res, next) => {
        const errors = [];

        if (params) {
            const { error, value } = params.validate(req.params, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) errors.push(...error.details.map((d) => ({ where: 'params', message: d.message })));
            req.params = value;
        }

        if (query) {
            const { error, value } = query.validate(req.query, {
                abortEarly: false,
                stripUnknown: true,
                convert: true
            });
            if (error) errors.push(...error.details.map((d) => ({ where: 'query', message: d.message })));
            req.query = value;
        }

        if (body) {
            const { error, value } = body.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) errors.push(...error.details.map((d) => ({ where: 'body', message: d.message })));
            req.body = value;
        }

        if (errors.length > 0) {
            return res.status(400).json({
                ok: false,
                error: 'ValidationError',
                details: errors
            });
        }

        next();
    };
}

module.exports = { validate };