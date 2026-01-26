/**
 * basicAuth.js
 * * Demonstrates secure username/password authentication using bcrypt.
 */

const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Mock Database (In real life, this is your MongoDB from Day 15)
const users = [];

// --- 2. REGISTRATION ROUTE (Creating a User) ---
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Generate a 'salt' and hash the password
        // The '10' is the cost factor (how many rounds of hashing)
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { username, password: hashedPassword };
        users.push(newUser);

        console.log('User registered:', newUser);
        res.status(201).send('User registered successfully!');
    } catch (error) {
        res.status(500).send('Error registering user.');
    }
});

// --- 3. LOGIN ROUTE (Verifying a User) ---
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user in our mock database
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(400).send('Cannot find user.');
    }

    try {
        // Compare the provided password with the hashed password in the DB
        // bcrypt.compare() handles the salt automatically
        if (await bcrypt.compare(password, user.password)) {
            res.send('✅ Login Success! Welcome, ' + username);
        } else {
            res.status(401).send('❌ Invalid Password.');
        }
    } catch (error) {
        res.status(500).send('Error during login.');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Auth server running at http://localhost:${PORT}`);
    console.log('1. Register a user at POST /register');
    console.log('2. Login at POST /login');
});

// curl -X POST http://localhost:3000/register \
//      -H "Content-Type: application/json" \
//      -d '{"username": "krisztina", "password": "mypassword123"}'

// curl -X POST http://localhost:3000/login \
//      -H "Content-Type: application/json" \
//      -d '{"username": "krisztina", "password": "mypassword123"}'

// curl -X POST http://localhost:3000/login \
//      -H "Content-Type: application/json" \
//      -d '{"username": "krisztina", "password": "wrongpassword"}'