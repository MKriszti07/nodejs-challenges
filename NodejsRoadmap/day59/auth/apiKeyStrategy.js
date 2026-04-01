const passport = require("passport");
const util = require("util");

/**
 * A custom Passport strategy:
 * - looks for Authorization: ApiKey <key>
 * - validates it against a lookup
 */
function ApiKeyStrategy(options = {}, verify) {
    if (!verify) throw new TypeError('ApiKeyStrategy requires a verify callback');

    passport.Strategy.call(this);
    this.name = options.name || 'api-key';
    this._verify = verify;
}

util.inherits(ApiKeyStrategy, passport.Strategy);

ApiKeyStrategy.prototype.authenticate = function authenticate(req) {
    const header = req.get('authorization') || '';
    const match = header.match(/^ApiKey\s+(.+)$/i);

    if (!match) {
        return this.fail({ message: 'Missing Authorization: ApiKey <key>'}, 401);
    }

    const apiKey = match[1].trim();
    if (!apiKey) {
        return this.fail({ message: 'Empty API key' }, 401);
    }

    // verify(apiKey, done)
    this._verify(apiKey, (err, user, info) => {
        if (err) return this.error(err);
        if (!user) return this.fail(info || { message: 'Invalid API key' }, 401);
        return this.success(user, info);
    });
};

module.exports = { ApiKeyStrategy };