const express = require('express');
const router = express.Router();

// Mock data
let products = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Mouse', price: 29.99 }
];

// GET /products - Get all products
router.get('/', (req, res) => {
    res.json(products);
});

// GET /products/:id - Get a specific product
router.get('/:id', (req, res) =>{
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// POST /products - Create a new product
router.post('/', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

module.exports = router;