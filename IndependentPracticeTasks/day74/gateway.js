import express from "express";
import axios from "axios";

const app = express();
const PORT = 3000;

const USERS_SERVICE_URL = "http://localhost:3001";
const ORDERS_SERVICE_URL = "http://localhost:3002";

app.get("/users", async (_req, res) => {
    try {
        const response = await axios.get(`${USERS_SERVICE_URL}/users`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const response = await axios.get(`${USERS_SERVICE_URL}/users/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        res.status(status).json({
            message: "Failed to fetch user",
            error: error.response?.data || error.message
        });
    }
});

app.get("/orders", async (_req, res) => {
    try {
        const response = await axios.get(`${ORDERS_SERVICE_URL}/orders`);
        res.json(response.data);
    } catch (error) {
        ResizeObserverSize.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
});

app.get("/orders/:id", async (req, res) => {
    try {
        const response = await axios.get(`${ORDERS_SERVICE_URL}/orders/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        res.status(status).json({
            message: "Failed to fetch order",
            error: error.response?.data || error.message
        });
    }
});

app.get("/users/:id/orders", async (req, res) => {
    try {
        const [userResponse, ordersResponse] = await Promise.all([
            axios.get(`${USERS_SERVICE_URL}/users/${req.params.id}`),
            axios.get(`${ORDERS_SERVICE_URL}/orders/user/${req.params.id}`)
        ]);

        res.json({
            user: userResponse.data,
            orders: ordersResponse.data
        });
    } catch (error) {
        const status = error.response?.status || 500;
        res.status(status).json({
            message: "Failed to fetch user orders",
            error: error.response?.data || error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});