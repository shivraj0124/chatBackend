const express = require("express");
const UserModel = require("../Models/userModel");
const generateToken = require("../Utils/generateToken");
const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const user = await UserModel.findOne({ username });
    if (user && user.password === password) {
      console.log(password, "Password", user.password);
      res.send({
        success: true,
        message: "Login Successful",
        user,
        token: generateToken(user._id),
      });
    } else if (user) {
      res.send({
        success: false,
        message: "Invalid Password",
      });
    } else {
      res.send({
        success: false,
        message: "Invalid Username and Password",
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: err,
    });
  }
};

const registerController = async (req, res) => {
  const { username, email, password, gender } = req.body;
  try {
    if (!username || !email || !password || !gender) {
      return res.send({
        success: false,
        message: "All fields are required.",
      });
    }
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.send({
        success: false,
        message: "User Already Exist",
      });
    }
    const userNameExist = await UserModel.findOne({ username });
    if (userNameExist) {
      return res.send({
        success: false,
        message: "UserName Already Exist",
      });
    }
    let profilePic
    if (gender === "Male") {
      profilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    } else if (gender === "Female") {
      profilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    }
    const user = await UserModel.create({ username, email, password, gender,profilePic });
    if (user) {
      return res.send({
        success: true,
        user,
        message: "User Registered Successfully.",
        token: generateToken(user._id),
      });
    } else {
      return res.send({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: err,
    });
  }
};

const fetchAllUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await UserModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send({ allUsers: users });
};
const fetchUserByUserName = async (req, res) => {
  try {
    const username = req.body.userName;
    const user = await UserModel.findOne({ username });
    if (user) {
      res.send({
        success: true,
        data: user,
      });
    } else {
      res.send({
        success: false,
        message: "User Not Found",
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};
module.exports = {
  loginController,
  registerController,
  fetchAllUsers,
  fetchUserByUserName,
};
