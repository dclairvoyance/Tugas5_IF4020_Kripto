import { useEffect, useRef } from "react";
import dummy_avatar from "../assets/avatar.webp";
import Message from "../components/Message";
import MessageBox from "./MessageBox";
import useGetMessages from "../hooks/useGetMessages";
import BackButton from "./BackButton";
import useChat from "../stores/useChat";

const Chat = () => {
  const lastMessageRef = useRef(null);

  const { loading, messages } = useGetMessages();
  const { selectedChat } = useChat();

  useEffect(() => {
    lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* header */}
      <div className="flex h-16 items-center bg-[#f0f2f5] dark:bg-[#1f2c33] border-b-2 border-[#f0f3f4] dark:border-[#1e2930] py-3 px-6">
        <BackButton />
        <img
          className="w-10 aspect-square my-auto object-cover rounded-full ml-3 md:ml-0"
          src={dummy_avatar}
        />
        <div className="flex-col my-auto ml-3 md:w-[calc(100%-3.25rem)] w-[calc(100%-6rem)]">
          <p className="text-start truncate text-md font-semibold">
            {selectedChat.displayName}
          </p>
        </div>
      </div>
      {/* messages */}
      <div className="h-full overflow-y-auto p-6 bg-[#efeae2] dark:bg-[#141d23]">
        {!loading &&
          messages.length > 0 &&
          messages.map((message) => (
            <Message key={message._id} message={message} />
          ))}
        {!loading && messages.length === 0 && (
          <p className="flex items-center justify-center h-full text-center text-[#8697a0] dark:text-[#aebac1]">
            Start messaging...
          </p>
        )}
        {loading && (
          <div className="flex h-full items-center justify-center">
            <div className="loading loading-spinner loading-sm text-[#8697a0] dark:text-[#aebac1]"></div>
          </div>
        )}
        <div ref={lastMessageRef}></div>
      </div>
      {/* message box */}
      <MessageBox />
    </>
  );
};

export default Chat;
