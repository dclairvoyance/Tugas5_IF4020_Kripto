import { useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa6";
import useSendMessage from "../hooks/useSendMessage";
import useChat from "../stores/useChat";
import toast from "react-hot-toast";
import { generateSignature } from "../utils/schnorr";

const MessageBox = () => {
  const [message, setMessage] = useState("");
  const [addSignature, setAddSignature] = useState(false);

  const { loading, sendMessage } = useSendMessage();
  const {
    selectedChat,
    chats,
    setChats,
    newChat,
    setNewChat,
    schnorr,
    publicKeys,
  } = useChat();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;

    // sign here
    const { s } = JSON.parse(localStorage.getItem("cc-signature")) || {
      s: null,
      v: null,
    };
    if (addSignature && !s) {
      toast.error("Private key (signature) is missing");
      return;
    }

    // encrypt here
    if (!publicKeys) {
      toast.error("Public key (encryption) is missing");
      return;
    }

    if (addSignature) {
      const signature = generateSignature(
        message,
        BigInt(schnorr.p),
        BigInt(schnorr.q),
        BigInt(schnorr.alpha),
        BigInt(s)
      );
      const signatureString = {
        e: signature.e.toString(),
        y: signature.y.toString(),
      };
      await sendMessage(message, signatureString, publicKeys[selectedChat._id]);
    } else {
      await sendMessage(message, null, publicKeys[selectedChat._id]);
    }

    if (newChat) {
      setChats([...chats, selectedChat]);
      setNewChat(false);
    }
    setMessage("");
  };

  useEffect(() => {
    if (selectedChat) {
      setMessage("");
      setAddSignature(false);
    }
  }, [selectedChat]);

  return (
    <div className="flex h-28 items-center bg-[#f0f2f5] dark:bg-[#1f2c33] px-6">
      <form
        className="flex items-center w-full mx-auto justify-between"
        onSubmit={handleSendMessage}
      >
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea
          id="message"
          className="bg-white text-gray-900 text-sm rounded-md w-[calc(100%-6rem)] py-2.5 px-4 dark:bg-[#2a3942] dark:placeholder-[#83949d] dark:text-white resize-none"
          placeholder="Tulis pesan..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <button
          className={`${
            addSignature ? "bg-[#8697a0] dark:bg-[#2a3942]" : "bg-[#f0f2f5]"
          } rounded-md h-10 w-10 dark:bg-[#1f2c33] hover:border hover:border-[#8697a0] hover:dark:bg-[#2a3942] ml-3`}
          onClick={() => setAddSignature(!addSignature)}
        >
          {!loading ? (
            <FaFileSignature
              className={`${
                addSignature ? "text-white" : "text-[#8697a0]"
              }  dark:text-[#aebac1] w-full`}
              size="1.5rem"
            />
          ) : (
            <span className="loading loading-spinner loading-sm text-[#8697a0] dark:text-[#aebac1]"></span>
          )}
        </button>
        <button
          type="submit"
          className="rounded-md h-10 w-10 bg-[#f0f2f5] dark:bg-[#1f2c33] hover:border hover:border-[#8697a0] hover:dark:bg-[#2a3942] ml-3"
        >
          {!loading ? (
            <MdSend
              className="text-[#8697a0] dark:text-[#aebac1] w-full"
              size="1.5rem"
            />
          ) : (
            <span className="loading loading-spinner loading-sm text-[#8697a0] dark:text-[#aebac1]"></span>
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageBox;
