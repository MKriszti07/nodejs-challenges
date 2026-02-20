const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { handleValidationErrors, ensureAuthenticated } = require('./middleware/validate');
const { registerValidation } = require('./validators/registerValidators');
const { loginValidation } = require('./validators/loginValidators');

const app = express();
const PORT = 3000;

// In-memory "database"
const users = [];
let currentId = 1;

// Middleware
app.use(express.json());
app.use(
    session({
        secret: 'supersecretkey', // in real apps, use env var
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Configure local strategy: email + password
passport.use(
    new LocalStrategy(
        { usernameField: 'email' },  // we use "email" instead of default "username"
        async (email, password, done) => {
            try {
                const user = findUserByEmail(email);
                if (!user) {
                    return done(null, false, { message: 'Incorrect email or password.' });
                }

                const match = await bcrypt.compare(password, user.passwordHash);
                if (!match) {
                    return done(null, false, { message: 'Incorrect email or password.' });
                }

                // Success
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

// What to store in session
passport.serializeUser((user, done) => {
    done(null, user.id);    // store only user.id in the session
});

// How to get full user from session
passport.deserializeUser((id, done) => {
    const user = users.find((u) => u.id === id);
    if (!user) {
        return done(null, false);
    }
    done(null, user);
})

// Find user helper
function findUserByEmail(email) {
    return users.find((user) => user.email === email);
}

app.post('/register', registerValidation, handleValidationErrors, async (req, res) => {
    const { email, password } = req.body;

    if (findUserByEmail(email)) {
        return res.status(400).sjon({
            success: false,
            message: 'Email is already registered',
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
        id: currentId++,
        email,
        passwordHash,
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: { id: newUser.id, email: newUser.email },
    });
});

app.post('/login', loginValidation, handleValidationErrors, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: info?.message || 'Login failed',
            });
        }

        // Log the user in and create session
        req.logIn(user, (err) => {
            if (err) return next(err);

            return res.json({
                success: true,
                message: 'Logged in successfully',
                user: { id: user.id, email: user.email },
            });
        });
    })(req, res, next);
});

app.get('/profile', ensureAuthenticated, (req, res) => {
    // req.user is set by Passport (from session)
    res.json({
        success: true,
        message: 'This is your profile',
        user: {
            id: req.user.id,
            email: req.user.email,
        },
    });
});

app.post('/logout', (req, res, next) => {
    req.logout(function (err) {
        if(err) {
            return next(err);
        }
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    });
});

app.get('/', (req, res) => {
    res.send('Passport Local Auth Demo');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// curl -X POST http://localhost:3000/register \
//   -H "Content-Type: application/json" \
//   -c cookies.txt \
//   -d '{"email":"test@example.com","password":"secret123"}'

// curl -X POST http://localhost:3000/login \
//   -H "Content-Type: application/json" \
//   -c cookies.txt -b cookies.txt \
//   -d '{"email":"test@example.com","password":"secret123"}'

// curl http://localhost:3000/profile -b cookies.txt

// curl -X POST http://localhost:3000/logout -b cookies.txt

// curl http://localhost:3000/profile -b cookies.txt