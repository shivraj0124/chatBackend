const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");

const allMessages = async (req, res) => {
  try {
    console.log("test",req.params.chatId);
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username email")
      .populate("receiver")
      .populate("chat");
    res.send({
      success: true,
      message: "All messages fetched",
      data: messages,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.send({
      success: false,
      message: "Invalid data passed into request",
    });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "username profilePic");
    message = await message.populate("chat");
    message = await message.populate("receiver");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username email",
    });

    const lastResult = await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
   
    res.send({
      success: true,
      message: "All messages fetched",
      data: message,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",error,
    });
  }
};

module.exports = { allMessages, sendMessage };
