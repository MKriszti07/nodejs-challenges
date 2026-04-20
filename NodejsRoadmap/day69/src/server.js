require("dotenv").config();

const express = require("express");
const { connectDB } = require("./db");
const { router } = require("./routes/index");

const app = express();
app.use(express.json());

app.use("/", router);

const port = Number(process.env.PORT || 3000);

async function start() {
  await connectDB(process.env.MONGODB_URI);

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
    console.log("Try: GET /health");
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

// Test:

// GET http://localhost:3000/reviews
// GET http://localhost:3000/books/<bookId>
// GET http://localhost:3000/users/<userId>
// GET http://localhost:3000/books/<bookId>/summary