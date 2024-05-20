import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useChat from "../stores/useChat";
import useSocket from "../stores/useSocket";

const useGetChats = () => {
  const [loading, setLoading] = useState(false);

  const { chats, setChats } = useChat();
  const { socket } = useSocket();

  const getChats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/chats");
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setChats(data.chats);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    socket?.on("newMessage", () => {
      getChats();
    });
  }, [socket]);

  return { loading, chats };
};

export default useGetChats;
