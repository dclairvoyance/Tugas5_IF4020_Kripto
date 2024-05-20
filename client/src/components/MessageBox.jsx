import { useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa6";
import useSendMessage from "../hooks/useSendMessage";
import useChat from "../stores/useChat";
import toast from "react-hot-toast";

const MessageBox = () => {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState(false);

  const { loading, sendMessage } = useSendMessage();
  const { selectedChat, chats, setChats, newChat, setNewChat } = useChat();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;

    // sign here
    const privateSign = JSON.parse(localStorage.getItem("cc-private-sign"));
    if (signature && !privateSign) {
      toast.error("Private key (signature) is missing");
      return;
    }

    // encrypt here
    const publicKeys = JSON.parse(localStorage.getItem("cc-public-keys"));
    if (!publicKeys) {
      toast.error("Public key (encryption) is missing");
      return;
    }
    await sendMessage(message, publicKeys[selectedChat._id]);
    if (newChat) {
      setChats([...chats, selectedChat]);
      setNewChat(false);
    }
    setMessage("");
  };

  useEffect(() => {
    if (selectedChat) {
      setMessage("");
      setSignature(false);
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
            signature ? "bg-[#8697a0]" : "bg-[#f0f2f5]"
          } rounded-md h-10 w-10 dark:bg-[#1f2c33] hover:border hover:border-[#8697a0] hover:dark:bg-[#2a3942] ml-3`}
          onClick={() => setSignature(!signature)}
        >
          {!loading ? (
            <FaFileSignature
              className={`${
                signature ? "text-white" : "text-[#8697a0]"
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
