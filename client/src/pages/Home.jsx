import { useEffect, useState } from "react";
import Chat from "../components/Chat";
import ChatList from "../components/ChatList";
import NoChatSelected from "../components/NoChatSelected";
import useChat from "../stores/useChat";

const Home = () => {
  const [chatOpen, setChatOpen] = useState(true);

  const { selectedChat, setSelectedChat } = useChat();

  useEffect(() => {
    return () => {
      setSelectedChat(null);
    };
  }, []);

  return (
    <>
      <div
        className={`w-full md:w-1/3 flex flex-col border-r-2 border-[#f0f3f4] dark:border-[#1e2930] ${
          chatOpen ? "hidden md:flex" : "flex"
        }`}
      >
        <ChatList />
      </div>
      <div
        className={`w-full md:w-2/3 flex flex-col ${
          chatOpen ? "flex" : "hidden md:flex"
        }`}
      >
        {!selectedChat ? (
          <NoChatSelected />
        ) : (
          <Chat setChatOpen={setChatOpen} />
        )}
      </div>
    </>
  );
};

export default Home;
