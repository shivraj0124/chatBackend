const express = require("express");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");
const accessChats = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.send({
      success: false,
      message: "User Id Not Found",
    });
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      {
        users: { $elemMatch: { $eq: req.user._id } },
      },
      {
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    res.send({
      success: true,
      message: "Chats Accessed",
      data: isChat[0],
    });
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.send({
        success: true,
        message: "Chat created and accessed Chats Accessed",
        data: fullChat,
      });
    } catch (err) {
      res.send({
        success: false,
        message: "Something Went Wrong",
      });
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email username",
        });
        res.send({
          success: true,
          message: "Chats Accessed",
          data: results,
        });
      });
  } catch (err) {
    res.send({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.send({
      success: false,
      message: "Insuffcient Data",
    });
  }

  let users = JSON.parse(req.body.users);
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.send({
      success: true,
      message: "Group Created SuccessFully",
      data: fullGroupChat,
    });
  } catch (err) {
    res.send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const fetchGroups = async (req, res) => {
  try {
    const allGroups = await Chat.where("isGroupChat").equals(true);
    res.send({
      success: true,
      message: "Groups Fetched Successfully",
      data: allGroups,
    });
  } catch (err) {
    res.send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const groupExit = async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  ).populate("users", "-password".populate("groupAdmin", "-password"));

  if (!removed) {
    res.send({
      success: false,
      message: "Chat Not Found",
    });
  } else {
    res.send({
      success: true,
      message: "Exit From Group",
      data: removed,
    });
  }
};

const addSelfToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.send({
      success: false,
      message: "Chat not found",
    });
  } else {
    res.send({
      success: true,
      message: "You are Added to Group.",
      data: added,
    });
  }
};

const fetchChatDetails = async (req, res) => {
  try {
    const { chatId } = req.body;
    const fullChat = await Chat.findOne({ _id: chatId });
    if (fullChat) {
      res.send({
        success: true,
        data: fullChat,
      });
    } else {
      res.send({
        success: false,
        message: "Chat not found",
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: "Something Went Wrong",
    });
  }
};
module.exports = {
  accessChats,
  fetchChats,
  createGroupChat,
  fetchGroups,
  groupExit,
  addSelfToGroup,
  fetchChatDetails
};
