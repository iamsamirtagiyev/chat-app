const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const maxAge = 60 * 60 * 24 * 365; // 1il

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

const register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ $or: [{ email: req.body.email }] });

    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const data = {
      fullname: `${req.body.first_name} ${req.body.last_name}`,
      email: req.body.email,
      password: req.body.password,
    };

    const user = new User(data);
    await user.save();
    const token = createToken(user._id);
    res.cookie("token", token, { http: true, secure: true, maxAge: maxAge * 1000 });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error during registration" });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = createToken(user._id);
    res.cookie("token", token, { http: true, secure: true, maxAge: maxAge * 1000 });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login" });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logout successful" });
};

module.exports = { register, login, logout };
