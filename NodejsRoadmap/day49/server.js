const express = require('express');
const cookieParser = require('cookie-parser');

const { authRouter } = require('./auth');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);

// Example protected route
const { requireAuth } = require('./tokens');
app.get('/private', requireAuth, (req, res) => {
    res.json({ message: "You are authenticated!", user: req.user });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
    console.log("Try POST /auth/login then GET /private, then POST /auth/refresh");
});

// curl -i -X POST http://localhost:3000/auth/login \
//   -H "Content-Type: application/json" \
//   -d '{"username":"admin","password":"admin"}' \
//   -c cookies.txt

// ACCESS="PASTE_TOKEN_HERE"
// curl -i http://localhost:3000/private -H "Authorization: Bearer $ACCESS"