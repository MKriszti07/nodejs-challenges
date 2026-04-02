const crypto = require('crypto');

function requestId(req, res, next) {
    const id = req.get('x-request-id') || crypto.randomUUID();
    req.requestId = id;
    res.setHeader('x-request-id', id);
    next();
}

module.exports = { requestId };