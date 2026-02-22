const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 3000;

app.use(express.json());

// 1) Global rate limiter (applies to all requests)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply global limiter to all routes
app.use(globalLimiter);

// 2) Stricter limiter for login endpoint
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: {
        success: false,
        message: 'Too many login attempts, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Routes

// Health check
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Rate limiting demo API is running',
    });
});

// Public route
app.get('/public', (req, res) => {
    res.json({
        success: true,
        data: 'This is public data',
    });
});

// Login route with stricter rate limit
app.post('/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;

    // Very simple fake login logic for demo:
    if (username === 'admin' && password === 'password') {
        return res.json({
            success: true,
            message: 'Logged in successfully (fake)',
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid username or password (fake)',
    });
});

// Some other API route
app.get('/data', (req, res) => {
    res.json({
        success: true,
        items: [1, 2, 3],
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// curl http://localhost:3000/
// curl http://localhost:3000/public
// curl http://localhost:3000/data

// for i in {1..110}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/public; done

// for i in {1..7}; do
//   echo "Attempt $i"
//   curl -s -o /dev/null -w "%{http_code}\n" \
//     -X POST http://localhost:3000/login \
//     -H "Content-Type: application/json" \
//     -d '{"username":"wrong","password":"wrong"}'
// done