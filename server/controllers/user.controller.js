import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const senderId = req.user._id;
    const searchQuery = req.query.search;

    // get users
    const users = !searchQuery
      ? []
      : await User.find({
          $and: [
            {
              $or: [
                { displayName: { $regex: searchQuery, $options: "i" } },
                { username: { $regex: searchQuery, $options: "i" } },
              ],
            },
            {
              _id: { $ne: senderId },
            },
          ],
        }).select("-password");

    // send response
    res.status(200).json({
      message: "Users fetched",
      users,
    });
  } catch (error) {
    console.error(`Error in get users controller: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChats = async (req, res) => {
  try {
    const senderId = req.user._id;

    // get chats
    const chats = await Chat.find({ users: senderId })
      .populate({
        path: "users",
        select: "-password",
      })
      .populate({
        path: "messages",
      });

    // sort based on latest message
    chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // send response
    res.status(200).json({
      message: "Chats fetched",
      chats: chats.map((chat) => {
        const otherUser = chat.users.find(
          (user) => user._id.toString() !== senderId.toString()
        );

        return {
          _id: otherUser._id,
          lastMessage: chat.messages[chat.messages.length - 1].message || "",
          updatedAt: chat.messages[chat.messages.length - 1].createdAt || "",
          displayName: otherUser.displayName,
          username: otherUser.username,
          profilePicture: otherUser.profilePicture,
        };
      }),
    });
  } catch (error) {
    console.error(`Error in get chats controller: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
