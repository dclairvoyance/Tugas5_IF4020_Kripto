import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useChat from "../stores/useChat";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);

  const { messages, setMessages, selectedChat } = useChat();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedChat._id}`);
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setMessages(data.messages);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedChat?._id) getMessages();
  }, [selectedChat, setMessages]);

  return { loading, messages };
};

export default useGetMessages;
