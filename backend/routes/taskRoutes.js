const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  downloadTasks
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all task routes
router.use(authMiddleware);

// Create task
router.post("/", createTask);

// Get all tasks
router.get("/", getTasks);

// Download tasks as CSV
// IMPORTANT: Keep this before /:id
router.get("/download", downloadTasks);

// Get single task
router.get("/:id", getTaskById);

// Update task
router.put("/:id", updateTask);

// Delete task
router.delete("/:id", deleteTask);

module.exports = router;