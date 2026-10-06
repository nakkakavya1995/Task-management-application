const mongoose = require("mongoose");

const taskHistorySchema = new mongoose.Schema(
  {
    // Task related to this history entry
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },

    // Store task title so history can still display it
    taskTitle: {
      type: String,
      required: true,
      trim: true
    },

    // Example:
    // Task created
    // Status changed
    // Priority changed
    // Task assignment changed
    // Task updated
    // Task deleted
    action: {
      type: String,
      required: true,
      trim: true
    },

    // User who performed the action
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Previous value
    oldValue: {
      type: String,
      default: ""
    },

    // New value
    newValue: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "TaskHistory",
  taskHistorySchema
);