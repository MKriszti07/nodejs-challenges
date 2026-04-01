const express = require('express');
const passport = require('passport');
const { ApiKeyStrategy } = require('./auth/apiKeyStrategy');

const app = express();
app.use(express.json());

// Practice user “database”
const API_KEYS = new Map([
  ["dev-key-123", { id: "u1", username: "alice", role: "user" }],
  ["dev-key-admin", { id: "u2", username: "bob", role: "admin" }]
]);

passport.use(
    new ApiKeyStrategy({}, (apiKey, done) => {
        const user = API_KEYS.get(apiKey);
        if (!user) return done(null, false, { message: 'Invalid API key' });
        return done(null, user);
    })
);

app.use(passport.initialize());

app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'Day 59 Passport custom strategy demo',
        hint: 'Try GET /private with Authorization: ApiKey dev-key-123'
    });
});

// Protected route
app.get(
    '/private',
    passport.authenticate('api-key', { session: false }),
    (req, res) => {
        res.json({
            ok: true,
            user: req.user
        });
    }
);

// Example: role-based authorization middleware
function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden (admin only)' });
    }
    next();
}

app.get(
    '/admin',
    passport.authenticate('api-key', { session: false }),
    requireAdmin,
    (req, res) => {
        res.json({ ok: true, message: 'Welcome admin!', user: req.user });
    }
);

app.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
});

//curl http://localhost:3000/
//curl -H "Authorization: ApiKey dev-key-123" http://localhost:3000/private
//curl http://localhost:3000/private
//curl -H "Authorization: ApiKey dev-key-admin" http://localhost:3000/admin