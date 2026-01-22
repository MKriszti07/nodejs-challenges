/**
 * restApi.js
 * * A simple RESTful API for managing a task list.
 */

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Mock Data (Our "Database")
let tasks = [
    { id: 1, title: 'Learn Node.js', completed: true },
    { id: 2, title: 'Master Express', completed: false }
];

// --- 2. RESTful Routes ---

// GET: Read all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// GET: Read a specific task using a Route Parameter (:id)
app.get('tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});

// POST: Create a new task
app.post('/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT: Update an existing task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        // Update the task data
        tasks[taskIndex].title = req.body.title || tasks[taskIndex].title;
        tasks[taskIndex].completed = req.body.completed !== undefined ? req.body.completed : tasks[taskIndex].completed;

        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});

// DELETE: Remove a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const originalLength = tasks.length;
    tasks = tasks.filter(t => t.id !== taskId);

    if (tasks.length < originalLength) {
        res.json({ message: `Task ${taskId} deleted successfully.` });
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 RESTful API running at http://localhost:${PORT}/tasks`);
});

//curl -X GET http://localhost:3000/tasks

// curl -X POST http://localhost:3000/tasks \
//      -H "Content-Type: application/json" \
//      -d '{"title": "Practice REST APIs"}'

// curl -X PUT http://localhost:3000/tasks/1 \
//      -H "Content-Type: application/json" \
//      -d '{"completed": false}'

//curl -X DELETE http://localhost:3000/tasks/2