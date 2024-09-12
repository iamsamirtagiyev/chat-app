const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const { app, server } = require("./socket");

// const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
dotenv.config();

const port = process.env.PORT || 3000;
server.listen(port, () => console.log("Server is running on port " + port));

mongoose
  .connect(process.env.CONNECT_URL)
  .then(() => console.log("Connected..."))
  .catch((error) => console.log("Error"));

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/auth", authRouter);
app.use("/api", userRouter);
