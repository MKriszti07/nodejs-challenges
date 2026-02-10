const express = require('express');
const router = express.Router();

// Mock data
let orders = [
    { id: 1, userId: 1, productId: 1, quantity: 2 },
    { id: 2, userId: 2, productId: 2, quantity: 1 }
];

// GET /orders - Get all orders
router.get('/', (req, res) => {
    res.json(orders);
});

// POST /orders - Create a new order
router.post('/', (req, res) => {
    const newOrder = {
        id: orders.length + 1,
        userId: req.body.userId,
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    orders.push(newOrder);
    res.status(201).json(neworder);
});

module.exports = router;