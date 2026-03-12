const express = require('express');

const app = express();

app.use(express.json());

const items = [{ id: 1, name: 'Item 1' }];

app.get('/items', (req, res) => {
    res.json({ success: true, data: items });
});

app.post('/items', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const newItem = { id: items.length + 1, name };
    items.push(newItem);
    res.status(201).json({ success: true, data: newItem });
});

module.exports = app;