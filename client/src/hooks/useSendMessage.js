import { useState } from "react";
import toast from "react-hot-toast";
import useChat from "../stores/useChat";
import { encrypt } from "../utils/delazi";
import { stringToHex } from "../utils/helpers";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);

  const { messages, setMessages, selectedChat } = useChat();

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const encrypted = encrypt(
        stringToHex(JSON.stringify({ message })),
        import.meta.env.VITE_BLOCK_CIPHER_EXTERNAL_KEY
      );

      const res = await fetch(`/api/messages/send/${selectedChat._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encrypted }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setMessages([...messages, data.messageSent]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessage };
};

export default useSendMessage;
