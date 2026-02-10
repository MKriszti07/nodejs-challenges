const express = require('express');
const app = express();

// Import routers
const userRoutes = require('./routers/users');
const productRoutes = require('./routers/products');
const orderRoutes = require('./routers/orders');

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Mount routers
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API',
        endpoints: {
            users: '/users',
            products: '/products',
            orders: '/orders'
        }
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

//curl http://localhost:3000/users
//curl http://localhost:3000/users/1

// curl -X POST http://localhost:3000/users \
//   -H "Content-Type: application/json" \
//   -d '{"name":"Alice Johnson","email":"alice@example.com"}'

// curl -X PUT http://localhost:3000/users/1 \
//   -H "Content-Type: application/json" \
//   -d '{"name":"John Updated"}'

//curl -X DELETE http://localhost:3000/users/1