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
    return (
      "[" +
      arr
        .map(
          (outerArray) =>
            "[" +
            outerArray
              .map((innerArray) => "[" + innerArray.join(",") + "]")
              .join(", ") +
            "]"
        )
        .join(", ") +
      "]"
    );
  };

  const sendMessage = async (message, pubKey) => {
    setLoading(true);

    try {
      if (!pubKey) {
        throw new Error("Public key is missing");
      }
      const key = pubKey.map((str) => BigInt(str));
      const encryptedMessage = encryptMessage(message, key);
      const result = convertArrayToBigintString(encryptedMessage);
      const encryptedBody = encrypt(
        stringToHex(JSON.stringify({ message: result })),
        sharedKey.key
      );

      const res = await fetch(`/api/messages/send/${selectedChat._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          uuid: sharedKey.uuid || "",
        },
        body: JSON.stringify({ encryptedBody }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      data.messageSent.message = message;
      const storedMessages =
        JSON.parse(localStorage.getItem("cc-messages")) || [];
      const newStoredMessage = [...storedMessages, data.messageSent];
      localStorage.setItem("cc-messages", JSON.stringify(newStoredMessage));
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
