import express from "express";

const app = express();
const PORT = 3002;

const orders = [
  { id: 1, userId: 1, product: "Keyboard", amount: 99 },
  { id: 2, userId: 1, product: "Mouse", amount: 49 },
  { id: 3, userId: 2, product: "Monitor", amount: 299 }
];

app.get("/orders", (_req, res) => {
    res.json(orders);
});

app.get("/orders/:id", (req, res) => {
    const orderId = Number(req.params.id);
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
});

app.get("/orders/user/:userId", (req, res) => {
    const userId = Number(req.params.userId);
    const userOrders = orders.filter((o) => o.userId === userId);

    res.json(userOrders);
});

app.listen(PORT, () => {
    console.log(`Orders service running on http://localhost:${PORT}`);
});