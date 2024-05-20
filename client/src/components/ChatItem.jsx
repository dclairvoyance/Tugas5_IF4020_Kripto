import { PropTypes } from "prop-types";
import dummy_avatar from "../assets/avatar.webp";
import useChat from "../stores/useChat";
import useWindow from "../stores/useWindow";
import useSocket from "../stores/useSocket";
import convertTime from "../utils/convertTime";
import { useEffect, useState } from "react";

const ChatItem = ({ chat }) => {
  const [lastMessage, setLastMessage] = useState("");

  const { chats, selectedChat, setSelectedChat, setNewChat } = useChat();
  const { setChatOpen } = useWindow();
  const { onlineUsers } = useSocket();

  const isSelected = selectedChat?._id === chat._id;
  const isOnline = onlineUsers.includes(chat._id);
  const formattedTime = convertTime(chat.updatedAt);

  useEffect(() => {
    const messages = JSON.parse(localStorage.getItem("cc-messages")) || [];
    setLastMessage(
      messages.find((item) => item._id === chat.lastMessageId)?.message
    );
  }, [chats]);

  return (
    <div
      className={`${
        isSelected ? "bg-[#f0f2f5] dark:bg-[#1f2c33]" : ""
      } hover:bg-[#f0f2f5] hover:dark:bg-[#1f2c33] flex p-3 overflow-x-auto cursor-pointer border-b-2 border-[#f0f3f4] dark:border-[#1e2930] h-[4.5rem]`}
      onClick={() => {
        setSelectedChat(chat);
        setNewChat(false);
        setChatOpen(true);
      }}
    >
      <img
        className="w-10 aspect-square my-auto object-cover rounded-full"
        src={chat.profilePicture || dummy_avatar}
      />
      <div className="flex-col my-auto ml-3 w-[calc(100%-3.25rem)]">
        <div className="flex justify-between">
          <p className="text-start truncate mr-3 text-md font-semibold">
            {chat.displayName} {isOnline ? "(Online)" : "(Offline)"}
          </p>
          <span className="flex text-xs items-center text-[#8697a0]">
            {formattedTime}
          </span>
        </div>
        <p className="text-start truncate text-xs text-[#8697a0]">
          {lastMessage}
        </p>
      </div>
    </div>
  );
};

ChatItem.propTypes = {
  chat: PropTypes.shape({
    _id: PropTypes.string,
    displayName: PropTypes.string,
    username: PropTypes.string,
    profilePicture: PropTypes.string,
    lastMessage: PropTypes.string,
    lastMessageSender: PropTypes.string,
    lastMessageId: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
};

export default ChatItem;
