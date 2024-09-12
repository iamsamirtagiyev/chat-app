const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserFromToken = require("./helpers/getUserFromToken");
const User = require("./models/user");
const { MessageModel, ConversationModel } = require("./models/conversation");
const getConversation = require("./helpers/getConversation");

require("dotenv").config();
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("connected " + socket.id);

  const token = socket.handshake.auth.token;
  const user = await getUserFromToken(token);

  socket.join(user?._id.toString());
  onlineUser.add(user?._id?.toString());

  io.emit("online-user", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    const userDetail = await User.findById(userId).select("-password");

    const payload = {
      _id: userDetail?._id,
      email: userDetail?.email,
      fullname: userDetail?.fullname,
      image: userDetail?.image,
      online: onlineUser?.has(userId),
    };

    socket.emit("message-user", payload);

    const getConversation = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", getConversation || []);
  });

  socket.on("new message", async (data) => {
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    if (!conversation) {
      const createConversation = await ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }

    const message = await MessageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data.msgByUserId,
    });

    const saveMessage = await message.save();

    const updateConversation = await ConversationModel.updateOne(
      { _id: conversation._id },
      {
        $push: { messages: saveMessage._id },
      }
    );

    const getConversations = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data.sender).emit("message", getConversations || []);
    io.to(data.receiver).emit("message", getConversations || []);

    const conversationSender = await getConversation(data.sender);
    const conversationReceiver = await getConversation(data.receiver);

    io.to(data.sender).emit("conversation", conversationSender);
    io.to(data.receiver).emit("conversation", conversationReceiver);
  });

  socket.on("sidebar", async (data) => {
    const conversationMessage = await getConversation(data);
    socket.emit("conversation", conversationMessage);
  });

  socket.on("seen", async (data) => {
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: user._id, receiver: data },
        { sender: data, receiver: user._id },
      ],
    });

    const conversationMessagesId = conversation?.messages || [];
    const updateMessages = await MessageModel.updateMany({ _id: { $in: conversationMessagesId }, msgByUserId: data }, { $set: { seen: true } });

    const conversationSender = await getConversation(user._id.toString());
    const conversationReceiver = await getConversation(data);

    io.to(user._id.toString()).emit("conversation", conversationSender);
    io.to(data).emit("conversation", conversationReceiver);
  });

  socket.on("disconnect", () => {
    onlineUser.delete(user?._id);
    console.log("disconnected " + socket.id);
  });
});

module.exports = { app, server };
