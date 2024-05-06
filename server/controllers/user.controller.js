import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";

export const getFriends = async (req, res) => {
  try {
    const senderId = req.user._id;

    // get friends
    const chats = await Chat.find({ users: senderId }).populate({
      path: "users",
      select: "-password",
    });
    const friends = chats.map((chat) =>
      chat.users.find((user) => user._id.toString() !== senderId.toString())
    );

    // send response
    res.status(200).json({
      message: "Friends fetched",
      friends,
    });
  } catch (error) {
    console.error(`Error in get friends controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
