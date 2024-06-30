const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../Controllers/messageControllers");
const  protect  = require("../Utils/authMiddleware");

const router = express.Router();

router.get("/:chatId",protect, allMessages);
router.post("/",protect, sendMessage);

module.exports = router;