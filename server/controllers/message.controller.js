import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";

export const get = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // check if chat exists
    let chat = await Chat.findOne({
      users: { $all: [senderId, receiverId], $size: 2 },
    }).populate("messages");
    if (!chat) {
      res.status(200).json({ messages: [] });
    } else {
      res.status(200).json({ messages: chat.messages });
    }
  } catch (error) {
    console.error(`Error in get messages controller: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const send = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;

    // check if chat exists
    let chat = await Chat.findOne({
      users: { $all: [senderId, receiverId], $size: 2 },
    });
    if (!chat) {
      chat = await Chat.create({
        users: [senderId, receiverId],
      });
    }

    // create new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    chat.messages.push(newMessage._id);
    await Promise.all([chat.save(), newMessage.save()]);

    // send response
    res.status(201).json({
      message: "Message sent",
      messageSent: {
        _id: newMessage._id,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        message: newMessage.message,
      },
    });
  } catch (error) {
    console.error(`Error in send message controller: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
