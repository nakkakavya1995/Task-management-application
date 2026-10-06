const express = require("express");

const {
  getHistory
} = require("../controllers/historyController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getHistory);

module.exports = router;