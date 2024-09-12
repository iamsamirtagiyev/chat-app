const { ConversationModel } = require("../models/conversation");

const getConversation = async (data) => {
  if (data) {
    const currentUserConversation = await ConversationModel.find({
      $or: [{ sender: data }, { receiver: data }],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");

    const conversationMessage = currentUserConversation.map((conv) => {
      const count = conv.messages.reduce((prev, current) => {
        const msgByUserId = current.msgByUserId.toString();
        if (msgByUserId != data) {
          return prev + (current.seen ? 0 : 1);
        } else {
          return prev;
        }
      }, 0);

      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unSeenMsg: count,
        lastMsg: conv.messages[conv?.messages.length - 1],
      };
    });

    return conversationMessage;
  } else {
    return [];
  }
};

module.exports = getConversation;
