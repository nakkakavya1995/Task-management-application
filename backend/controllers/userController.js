const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      {
        _id: { $ne: req.userId }
      },
      {
        name: 1,
        email: 1
      }
    ).sort({ name: 1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

module.exports = {
  getUsers
};