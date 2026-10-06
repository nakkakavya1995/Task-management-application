const Task = require("../models/Task");
const User = require("../models/User");
const TaskHistory = require("../models/TaskHistory");
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);

      if (!assignedUser) {
        return res.status(400).json({
          message: "Assigned user not found"
        });
      }
    }

    // Create task
    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      priority: priority || "MEDIUM",
      status: status || "PENDING",
      dueDate: dueDate || null,
      user: req.userId,
      assignedTo: assignedTo || null
    });
    await TaskHistory.create({
      task: task._id,
      taskTitle: task.title,
      action: "Task Created",
      performedBy: req.userId,
      oldValue: "",
      newValue: ""
    });

    // --------------------------------------------------
    // TASK ASSIGNED HISTORY
    // --------------------------------------------------
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);

      await TaskHistory.create({
        task: task._id,
        taskTitle: task.title,
        action: "Task Assigned",
        performedBy: req.userId,
        oldValue: "Not assigned",
        newValue: assignedUser
          ? assignedUser.name
          : "Unknown user"
      });
    }

    // Populate users before sending response
    await task.populate("user", "name email");
    await task.populate("assignedTo", "name email");

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {
    console.error("CREATE TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to create task",
      error: error.message
    });
  }
};
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { user: req.userId },
        { assignedTo: req.userId }
      ]
    })
      .populate("user", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);

  } catch (error) {
    console.error("GET TASKS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message
    });
  }
};
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { user: req.userId },
        { assignedTo: req.userId }
      ]
    })
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);

  } catch (error) {
    console.error("GET TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch task",
      error: error.message
    });
  }
};
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo
    } = req.body;

    // Find task
    const task = await Task.findOne({
      _id: id,
      $or: [
        { user: req.userId },
        { assignedTo: req.userId }
      ]
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }
    const oldStatus = task.status;
    const oldPriority = task.priority;

    const oldAssignedTo = task.assignedTo
      ? task.assignedTo.toString()
      : null;

    const newAssignedTo = assignedTo
      ? assignedTo.toString()
      : null;
    if (
      assignedTo !== undefined &&
      task.user.toString() !== req.userId.toString()
    ) {
      return res.status(403).json({
        message: "Only the task owner can change assignment"
      });
    }
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);

      if (!assignedUser) {
        return res.status(400).json({
          message: "Assigned user not found"
        });
      }
    }
    if (title !== undefined) {
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (status !== undefined) {
      task.status = status;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }

    if (assignedTo !== undefined) {
      task.assignedTo = assignedTo || null;
    }
    await task.save();
    if (
      status !== undefined &&
      oldStatus !== task.status
    ) {
      await TaskHistory.create({
        task: task._id,
        taskTitle: task.title,
        action: "Status changed",
        performedBy: req.userId,
        oldValue: oldStatus,
        newValue: task.status
      });
    }
    if (priority !== undefined &&
      oldPriority !== task.priority)
     {
      await TaskHistory.create({
        task: task._id,
        taskTitle: task.title,
        action: "Priority changed",
        performedBy: req.userId,
        oldValue: oldPriority,
        newValue: task.priority
      });
    }

    if (assignedTo !== undefined &&
      oldAssignedTo !== newAssignedTo)
     {
      let oldAssigneeName = "Not assigned";
      let newAssigneeName = "Not assigned";
      if (oldAssignedTo) {
        const oldUser = await User.findById(oldAssignedTo);

        if (oldUser) {
          oldAssigneeName =
            oldUser.name ||
            oldUser.email ||
            "Unknown user";
        }
      }
      if (newAssignedTo) {
        const newUser = await User.findById(newAssignedTo);

        if (newUser) {
          newAssigneeName =
            newUser.name ||
            newUser.email ||
            "Unknown user";
        }
      }
      await TaskHistory.create({
        task: task._id,
        taskTitle: task.title,
        action: "Task Assigned",
        performedBy: req.userId,
        oldValue: oldAssigneeName,
        newValue: newAssigneeName
      });
    }
    const onlyBasicFieldsChanged =
      (title !== undefined && title !== "") ||
      description !== undefined ||
      dueDate !== undefined;

    const statusChanged =
      status !== undefined &&
      oldStatus !== task.status;

    const priorityChanged =
      priority !== undefined &&
      oldPriority !== task.priority;

    const assignmentChanged =
      assignedTo !== undefined &&
      oldAssignedTo !== newAssignedTo;


    if (
      onlyBasicFieldsChanged &&
      !statusChanged &&
      !priorityChanged &&
      !assignmentChanged
    ) {
      await TaskHistory.create({
        task: task._id,
        taskTitle: task.title,
        action: "Task Updated",
        performedBy: req.userId,
        oldValue: "",
        newValue: ""
      });
    }
    await task.populate("user", "name email");
    await task.populate("assignedTo", "name email");


    res.status(200).json({
      message: "Task updated successfully",
      task
    });

  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to update task",
      error: error.message
    });
  }
};
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      _id: id,
      user: req.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found or you are not allowed to delete it"
      });
    }
    await TaskHistory.create({
      task: task._id,
      taskTitle: task.title,
      action: "Task Deleted",
      performedBy: req.userId,
      oldValue: "",
      newValue: ""
    });
await Task.findByIdAndDelete(id);
res.status(200).json({
      message: "Task deleted successfully"
    });

  } catch (error) {
    console.error("DELETE TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to delete task",
      error: error.message
    });
  }
};
const downloadTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { user: req.userId },
        { assignedTo: req.userId }
      ]
    })
      .populate("user", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
    let csv = "";
    csv += "Title,Description,Priority,Status,Due Date,Assigned To,Created At\n";
    tasks.forEach((task) => {
      const title = `"${(task.title || "").replace(/"/g, '""')}"`;

      const description =
        `"${(task.description || "").replace(/"/g, '""')}"`;

      const priority = `"${task.priority || ""}"`;

      const status = `"${task.status || ""}"`;

      const dueDate = task.dueDate
        ? `"${new Date(task.dueDate).toLocaleDateString("en-IN")}"`
        : `""`;

      const assignedTo =
        task.assignedTo
          ? `"${(
              task.assignedTo.name ||
              task.assignedTo.email ||
              ""
            ).replace(/"/g, '""')}"`
          : `""`;

      const createdAt = task.createdAt
        ? `"${new Date(task.createdAt).toLocaleString("en-IN")}"`
        : `""`;


      csv += [
        title,
        description,
        priority,
        status,
        dueDate,
        assignedTo,
        createdAt
      ].join(",");

      csv += "\n";
    });
    res.setHeader(
      "Content-Type",
      "text/csv"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="tasks.csv"'
    );

    res.status(200).send(csv);

  } catch (error) {
    console.error("DOWNLOAD TASKS ERROR:", error);

    res.status(500).json({
      message: "Failed to download tasks",
      error: error.message
    });
  }
};
module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  downloadTasks
};