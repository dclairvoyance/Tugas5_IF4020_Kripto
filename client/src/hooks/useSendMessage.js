import { useState } from "react";
import toast from "react-hot-toast";
import useChat from "../stores/useChat";
import { encrypt } from "../utils/delazi";
import { encryptMessage } from "../utils/ecc";
import { stringToHex } from "../utils/helpers";
import useSocket from "../stores/useSocket";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);

  const { messages, setMessages, selectedChat } = useChat();
  const { sharedKey } = useSocket();


  const convertArrayToBigintString = (arr) => {
    return '[' + arr.map((outerArray) => 
      '[' + outerArray.map((innerArray) => 
        '[' + innerArray.join(',') + ']'
      ).join(', ') + ']'
    ).join(', ') + ']';
  }

  const sendMessage = async (message, pubKey) => {
    setLoading(true);

    try {
      const key = pubKey.map(str => BigInt(str));
      const firstEncrypt = encryptMessage(message, key);
      const result = convertArrayToBigintString(firstEncrypt);
      const encrypted = encrypt(
        stringToHex(JSON.stringify({ "message":result })),
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
      data.messageSent.message = message;
      const storedMessages = JSON.parse(localStorage.getItem("user-message")) || [];
      const newLocalMessage = [...storedMessages, data];
      localStorage.setItem("user-message", JSON.stringify(newLocalMessage));
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
