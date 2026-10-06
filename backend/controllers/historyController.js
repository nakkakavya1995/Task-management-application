const TaskHistory = require("../models/TaskHistory");
const User = require("../models/User");
const getHistory = async (req, res) => {
  try {
    console.log("HISTORY USER ID:", req.userId);

    const history = await TaskHistory.find({
      performedBy: req.userId
    })
      .populate("task", "title")
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 });
    const formattedHistory = await Promise.all(
      history.map(async (item) => {
        const historyItem = item.toObject();
        if (
          historyItem.action &&
          historyItem.action.toLowerCase().includes("assigned")
        ) {
          let assignedName = historyItem.newValue;
          const match = assignedName?.match(
            /(?:Assigned to user\s+)([a-f0-9]{24})/i
          );

          if (match) {
            const userId = match[1];

            const assignedUser = await User.findById(userId)
              .select("name email");

            if (assignedUser) {
              assignedName =
                assignedUser.name ||
                assignedUser.email ||
                "Unknown user";
            }
          }

          historyItem.newValue = assignedName;
        }

        return historyItem;
      })
    );

    console.log("FORMATTED HISTORY:", formattedHistory);

    res.status(200).json(formattedHistory);

  } catch (error) {
    console.error("GET HISTORY ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch history",
      error: error.message
    });
  }
};

module.exports = {
  getHistory
};
