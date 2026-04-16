require('dotenv').config();

const express = require('express');
const { validate } = require('./validation/validate');
const { createUserBody, listUsersQuery, userIdParams } = require('./validation/schemas');

const app = express();
app.use(express.json());

// Fake in-memory store
const users = new Map();
let nextId = 1;

// List users (validates query)
app.get('/users', validate({ query: listUsersQuery }), (req, res) => {
    const { page, pageSize, sort } = req.query;

    const all = Array.from(users.values());
    all.sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name);
        return a.createdAt - b.createdAt;
    });

    const start = (page - 1) * pageSize;
    const items = all.slice(start, start + pageSize);

    res.json({ ok: true, page, pageSize, total: all.length, items });
});

// Create user (validates body)
app.post('/users', validate({ body: createUserBody }), (req, res) => {
    const id = nextId++;
    const user = {
        id,
        ...req.body,
        createdAt: Date.now()
    };

    users.set(id, user);
    res.status(201).json({ ok: true, user });
});

// Get user by id (validates params)
app.get('/users/:id', validate({ params: userIdParams }), (req, res) => {
    const id = Number(req.params.id);
    const user = users.get(id);
    if (!user) return res.status(404).json({ ok: false, error: 'NotFound' });
    res.json({ ok: true, user });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`http://localhost:${port}`));

// # invalid query (page must be >= 1)
// curl -i "http://localhost:3000/users?page=0"

// # invalid body (email missing)
// curl -i -X POST "http://localhost:3000/users" \
//   -H "content-type: application/json" \
//   -d '{"name":"A"}'

// # valid create
// curl -s -X POST "http://localhost:3000/users" \
//   -H "content-type: application/json" \
//   -d '{"email":"a@b.com","name":"Alice","age":25}'