import { useState } from "react";
import toast from "react-hot-toast";
import useChat from "../stores/useChat";
import { encrypt } from "../utils/delazi";
import { stringToHex } from "../utils/helpers";
import useSocket from "../stores/useSocket";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);

  const { messages, setMessages, selectedChat } = useChat();
  const { sharedKey } = useSocket();

  const sendMessage = async (message) => {
    setLoading(true);

    try {
      const encrypted = encrypt(
        stringToHex(JSON.stringify({ message })),
        sharedKey.key
      );

      const res = await fetch(`/api/messages/send/${selectedChat._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          uuid: sharedKey.uuid || "",
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
