import { useEffect } from "react";
import useChat from "../stores/useChat";
import useSocket from "../stores/useSocket";

const useListenMessages = () => {
  const { messages, setMessages } = useChat();
  const { socket } = useSocket();

  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      setMessages([...messages, newMessage]);
    });
  }, [socket, messages, setMessages]);
};

export default useListenMessages;
