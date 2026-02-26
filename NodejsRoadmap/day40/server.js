require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory "database"
const users = [];

// Passport serialize/deserialize
passport.serializeUser((user, done) => {
    done(null, user.id); // store only user.id in the session
});

passport.deserializeUser((id, done) => {
    const user = users.find((u) => u.id === id);
    done(null, user || false);
});

// Configure Google OAuth2 strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            // Called when Google has authenticated the user

            // Try to find existing user
            let user = users.find((u) => u.googleId === profile.id);

            if (!user) {
                // Create new user in our "DB"
                user = {
                    id: users.length + 1, // simple numeric id
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails?.[0]?.value || null,
                    photo: profile.photos?.[0]?.value || null,
                };
                users.push(user);
            }

            // Continue with user
            return done(null, user);
        }
    )
);

// Session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'dev_secret',
        resave: false,
        saveUninitialized: false,
    })
);

// Initialize Passport and restore auth state from session
app.use(passport.initialize());
app.use(passport.session());

// Helper: require login
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    res.status(401).json({
        success: false,
        message: 'Not authenticated',
    });
}

// Routes

app.get('/', (req, res) => {
    res.send(`
    <h1>Day 40: Google OAuth2 Demo</h1>
    <p><a href="/auth/google">Log in with Google</a></p>
    <p><a href="/profile">View profile (protected)</a></p>
    <p><a href="/logout">Logout</a></p>
  `);
});

// 1) Start Google OAuth2 login flow
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'], })
);

// 2) Google redirects back here after user approves/denies
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login-failed' }),
    (req, res) => {
        // Successful authentication, redirect or respond
        res.redirect('/profile');
    }
);

// Optional failure route
app.get('/login-failed', (req, res) => {
    res.status(401).send('Login failed. <a href="/auth/google">Try again</a>');
});

// 3) Protected profile route
app.get('/profile', ensureAuthenticated, (req, res) => {
    const user = req.user;
    res.send(`
    <h1>Your Profile</h1>
    <p><strong>ID:</strong> ${user.id}</p>
    <p><strong>Google ID:</strong> ${user.googleId}</p>
    <p><strong>Name:</strong> ${user.displayName}</p>
    <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
    ${user.photo
            ? `<p><img src="${user.photo}" alt="profile photo" width="100"/></p>`
            : ''
        }
    <p><a href="/logout">Logout</a></p>
  `);
});

// 4) Logout
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Go to http://localhost:3000 and click "Log in with Google".');
});