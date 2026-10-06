const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const taskHistoryRoutes = require("./routes/taskHistoryRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Task Management API is running"
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);
app.use("/api/history", taskHistoryRoutes);

app.use("/api/users", userRoutes);

app.use(
  "/api/task-history",
  taskHistoryRoutes
);

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});