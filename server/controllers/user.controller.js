import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";

export const getChats = async (req, res) => {
  try {
    const senderId = req.user._id;

    // get chats
    const chats = await Chat.find({ users: senderId }).populate({
      path: "users",
      select: "-password",
    });

    // send response
    res.status(200).json({
      message: "Chats fetched",
      chats: chats.map((chat) =>
        chat.users.find((user) => user._id.toString() !== senderId.toString())
      ),
    });
  } catch (error) {
    console.error(`Error in get chats controller: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
