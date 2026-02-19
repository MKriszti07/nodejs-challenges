const express = require('express');
const { registerValidation } = require('./validators/authValidators');
const { userIdParamValidation } = require('./validators/userValidators');
const handleValidationErrors = require('./middleware/validate');

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory "database"
const users = [];
let currentId = 1;

// POST /auth/register
app.post('/auth/register', registerValidation, handleValidationErrors, (req, res) => {
    const { name, email, password, age } = req.body;

    // Fake "create user"
    const newUser = {
        id: currentId++,
        name,
        email,
        age: age || null,
        password,   // NOTE: In real apps, never store password in plain text.
    };

    users.push(newUser);

    // Omit password in response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
        success: true,
        data: userWithoutPassword,
    });
});

// GET /users/:id
app.get('/users/:id', userIdParamValidation, handleValidationErrors, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    const { password, ...userWithoutPassword } = user;

    res.json({
        success: true,
        data: userWithoutPassword,
    });
});

// Health check
app.get('/', (req, res) => {
    res.send('Express Validation Middleware Demo');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// curl -X POST http://localhost:3000/auth/register \
//   -H "Content-Type: application/json" \
//   -d '{
//     "name": "Kriszti",
//     "email": "kriszti@example.com",
//     "password": "secret123",
//     "age": 20
//   }'

// curl -X POST http://localhost:3000/auth/register \
//   -H "Content-Type: application/json" \
//   -d '{
//     "name": "K",
//     "password": "123"
//   }'

// curl http://localhost:3000/users/abc