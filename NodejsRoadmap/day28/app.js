const express = require('express');
const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'JWT Authentication API',
        endpoints: {
            register: 'POST /auth/register',
            login: 'POST /auth/login',
            profile: 'GET /profile (requires token)',
            admin: 'GET /admin (requires token + admin role)'
        }
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// curl -X POST http://localhost:3000/auth/register \
//   -H "Content-Type: application/json" \
//   -d '{
//     "username": "john_doe",
//     "email": "john@example.com",
//     "password": "password123"
//   }'

// curl -X POST http://localhost:3000/auth/register \
//   -H "Content-Type: application/json" \
//   -d '{
//     "username": "admin",
//     "email": "admin@example.com",
//     "password": "admin123",
//     "role": "admin"
//   }'

// curl -X POST http://localhost:3000/auth/login \
//   -H "Content-Type: application/json" \
//   -d '{
//     "email": "john@example.com",
//     "password": "password123"
//   }'

// curl http://localhost:3000/profile \
//   -H "Authorization: Bearer YOUR_TOKEN_HERE"

// curl http://localhost:3000/profile

// curl http://localhost:3000/admin \
//   -H "Authorization: Bearer REGULAR_USER_TOKEN"

// curl http://localhost:3000/admin \
//   -H "Authorization: Bearer ADMIN_TOKEN"