import { useEffect } from "react";
import Chat from "../components/Chat";
import ChatList from "../components/ChatList";
import NoChatSelected from "../components/NoChatSelected";
import useChat from "../stores/useChat";
import useWindow from "../stores/useWindow";

const Home = () => {
  const { chatOpen } = useWindow();
  const { selectedChat, setSelectedChat } = useChat();

  useEffect(() => {
    return () => {
      setSelectedChat(null);
    };
  }, [setSelectedChat]);

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
        {!selectedChat ? <NoChatSelected /> : <Chat />}
      </div>
    </>
  );
};

export default Home;
