function cacheControl(seconds) {
    return function (req, res, next) {
        res.setHeader('Cache-Control', `public, max-age=${seconds}, immutable`);
        next();
    };
}

module.exports = { cacheControl };