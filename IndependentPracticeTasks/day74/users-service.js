import express from "express";

const app = express();
const PORT = 3001;

const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" }
];

app.get("/users", (_req, res) => {
    res.json(users);
});

app.get("/users/:id", (req, res) => {
    const userId = Number(req.params.id);
    const user = users.find((u) => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
});

app.listen(PORT, () => {
    console.log(`Users service running on http://localhost:${PORT}`);
});