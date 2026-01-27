/**
 * sessionExample.js
 * * Demonstrates user authentication using express-session and cookies.
 */

const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 3000;

// --- 1. Configure Session Middleware ---
app.use(session({
    secret: 'my-super-secret-key',  // Used to sign the session ID cookie
    resave: false,                  // Don't save session if unmodified
    saveUninitialized: false,       // Don't create session until something is stored
    cookie: {
        maxAge: 60000,              // Cookie expires after 60 seconds (for testing)
        httpOnly: true              // Prevents client-side JS from reading the cookie
    }
}));

app.use(express.json());
app.use(express.urlencoded( { extended: true } ));

// --- 2. Routes ---

// Home route: Checks if user is "logged in" via session
app.get('/', (req, res) => {
    if (req.session.username) {
        res.send(`
            <h1>Welcome back, ${req.session.username}!</h1>
            <p>Your session is active.</p>
            <a href="/logout">Logout</a>
        `);
    } else {
        res.send(`
            <h1>Home Page</h1>
            <p>You are not logged in.</p>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <button type="submit">Login</button>
            </form>
        `);
    }
});

// Login route: Stores username in the session
app.post('/login', (req, res) => {
    const { username } = req.body;

    // In a real app, you'd verify the password here.
    // Storing data in req.session creates the session.
    req.session.username = username;

    console.log(`Session created for: ${username}`);
    res.redirect('/');
});

// Logout route: Destroys the session
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error logging out.');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/');
    });
});

// Protected "Profile" route
app.get('/profile', (req, res) => {
    if (req.session.username) {
        res.send(`User Profile: ${req.session.username}`);
    } else {
        res.status(401).send('Please log in to see your profile.');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Session server running at http://localhost:${PORT}`);
});