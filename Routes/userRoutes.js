const express = require("express");
const {
  loginController,
  registerController,
  fetchAllUsers,
  fetchUserByUserName
} = require("../Controllers/userController");
const protect = require("../Utils/authMiddleware");

const Router = express.Router();

Router.post("/login", loginController);
Router.post("/register", registerController);
Router.get("/fetchAllUsers", protect, fetchAllUsers);
Router.post("/fetchUserByUserName", protect, fetchUserByUserName);

module.exports = Router;
