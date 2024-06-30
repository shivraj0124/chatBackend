const mongoose = require('mongoose')
const UserModel = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
      },
      gender: {
        type: String,
        required: true,
      },
      profilePic: {
        type: String,
        default: "",
      },

    },
    {
      timestamps: true,
    }
  );
  const User = mongoose.model("User", UserModel);
  module.exports = User;