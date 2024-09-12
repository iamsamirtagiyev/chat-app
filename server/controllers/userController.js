const getUserFromToken = require("../helpers/getUserFromToken");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userInfo = async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const user = await getUserFromToken(token);
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const userDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: "Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const token = req.cookies.token || "";

    const user = await getUserFromToken(token);

    const updateUser = await User.updateOne({ _id: user._id }, req.body);
    const userInfo = await User.findById(user._id);

    res.status(200).json({ message: "user update successfully", userInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchUser = async (req, res) => {
  try {
    const query = new RegExp(req.body.search, i, g);

    const user = await User.find({ fullname: query }).select("-password");
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { userInfo, userDetail, updateUser, searchUser, allUsers };
