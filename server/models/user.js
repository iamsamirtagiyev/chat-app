const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
