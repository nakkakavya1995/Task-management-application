const TaskHistory = require("../models/TaskHistory");

// Get history for logged-in user
const getHistory = async (req, res) => {
  try {
    const history = await TaskHistory.find({
      user: req.userId
    })
      .populate("task", "title")
      .sort({ createdAt: -1 });

    res.json(history);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch history",
      error: error.message
    });
  }
};

module.exports = {
  getHistory
};