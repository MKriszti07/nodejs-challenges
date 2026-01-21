/**
 * queryExample.js
 * * Demonstrates handling query parameters using req.query in Express.
 */

const express = require('express');
const app = express();
const PORT = 3000;

// Sample data to simulate a database
const products = [
    { id: 1, name: 'Laptop', category: 'electronics' },
    { id: 2, name: 'Phone', category: 'electronics' },
    { id: 3, name: 'Shirt', category: 'clothing' },
    { id: 4, name: 'Coffee Mug', category: 'home' },
    { id: 5, name: 'Headphones', category: 'electronics' }
];

app.get('/products', (req, res) => {
    // 1. Access query parameters from req.query
    // Example URL: /products?category=electronics&limit=2
    const { category, limit } = req.query;

    let filteredProducts = products;

    // 2. Apply filtering logic if 'category' is provided
    if (category) {
        filteredProducts = filteredProducts.filter(
            p => p.category === category.toLowerCase()  
        );
    }

    // 3. Apply limit logic if 'limit' is provided
    if (limit) {
        filteredProducts = filteredProducts.slice(0, parseInt(limit));
    }

    // 4. Send the result
    res.json({
        total: filteredProducts.length,
        filtersUsed: { category, limit },
        data: filteredProducts
    });
});

// A simpler example for a greeting
app.get('/greet', (req, res) => {
    // URL: /greet?name=Krisztina
    const name = req.query.name || 'Guest';
    res.send(`<h1>Hello, ${name}!</h1>`);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log('Try these URLs:');
    console.log(' - http://localhost:3000/greet?name=YourName');
    console.log(' - http://localhost:3000/products?category=electronics');
    console.log(' - http://localhost:3000/products?category=electronics&limit=1');
});