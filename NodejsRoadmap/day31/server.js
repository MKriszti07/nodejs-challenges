const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());

// CORS Configuration - Method 1: Allow all origins (for development)
// app.use(cors());

// CORS Configuration - Method 2: Specific configuration (recommended for production)
const corsOptions = {
    origin: 'http://localhost:3000', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));

// In-memory database
let todos = [
    { id: 1, title: 'Learn Node.js', completed: false },
    { id: 2, title: 'Understand CORS', completed: false },
    { id: 3, title: 'Build an API', completed: true },
];

// Routes
app.get('/api/todos', (req, res) => {
    res.json({ success: true, data: todos });
});

app.post('/api/todos', (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const newTodo = {
        id: todos.length + 1,
        title,
        completed: false
    };

    todos.push(newTodo);
    res.status(201).json({ success: true, data: newTodo });
});

app.put('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todo = todos.find(t => t.id === parseInt(id));

    if (!todo) {
        return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    res.json({ success: true, data: todo });
});

app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const index = todos.findIndex(t => t.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    todos.splice(index, 1);
    res.json({ success: true, message: 'Todo deleted' });
});

app.get('/', (req, res) => {
    res.send('Todo API - CORS Enabled');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});