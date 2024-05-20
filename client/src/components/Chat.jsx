import { useEffect, useRef, useState } from "react";
import dummy_avatar from "../assets/avatar.webp";
import Message from "./Message";
import MessageBox from "./MessageBox";
import useGetMessages from "../hooks/useGetMessages";
import BackButton from "./BackButton";
import useChat from "../stores/useChat";
import useListenMessages from "../hooks/useListenMessages";
import FileInput from "./FileInput";

const Chat = () => {
  const lastMessageRef = useRef(null);
  const fileEcInputRef = useRef(null);
  const fileScInputRef = useRef(null);

  const [publicKeys, setPublicKeys] = useState({});
  const [publicSigns, setPublicSigns] = useState({});

  const { loading, messages } = useGetMessages();
  const { selectedChat } = useChat();

  const handleFileEcChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const contents = reader.result;
        const contentArr = contents.split(",");

        const newPublicKeys = { ...publicKeys, [selectedChat._id]: contentArr };
        setPublicKeys(newPublicKeys);
        localStorage.setItem("cc-public-keys", JSON.stringify(newPublicKeys));
      };

      reader.onerror = () => {
        console.error("Error reading file.");
      };

      reader.readAsText(file);
    }
  };

  const handleFileScChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const contents = reader.result;
        const contentArr = contents.split(",");

        const newPublicSigns = {
          ...publicSigns,
          [selectedChat._id]: contentArr,
        };
        setPublicSigns(newPublicSigns);
        localStorage.setItem("cc-public-signs", JSON.stringify(newPublicSigns));
      };

      reader.onerror = () => {
        console.error("Error reading file.");
      };

      reader.readAsText(file);
    }
  };

  useListenMessages();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const storedPublicKeys = JSON.parse(localStorage.getItem("cc-public-keys"));
    if (storedPublicKeys) {
      setPublicKeys(storedPublicKeys);
    }

    const storedPublicSigns = JSON.parse(
      localStorage.getItem("cc-public-signs")
    );
    if (storedPublicSigns) {
      setPublicSigns(storedPublicSigns);
    }
  }, []);

  return (
    <>
      {/* header */}
      <div className="flex h-16 items-center bg-[#f0f2f5] dark:bg-[#1f2c33] border-b-2 border-[#f0f3f4] dark:border-[#1e2930] py-3 px-6">
        <BackButton />
        <img
          className="w-10 aspect-square my-auto object-cover rounded-full ml-3 md:ml-0"
          src={selectedChat.profilePicture || dummy_avatar}
        />
        <div className="flex-col my-auto ml-3 md:w-[calc(100%-3.25rem)] w-[calc(100%-6rem)]">
          <p className="text-start truncate text-md font-semibold">
            {selectedChat.displayName}
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <FileInput
            handleOnChangeParent={handleFileScChange}
            fileName="scpub"
            isPublicExists={publicSigns[selectedChat._id]?.length > 0}
          />
          <FileInput
            handleOnChangeParent={handleFileEcChange}
            fileName="ecpub"
            isPublicExists={publicKeys[selectedChat._id]?.length > 0}
          />
        </div>
      </div>
      {/* messages */}
      <div className="h-full overflow-y-auto p-6 bg-[#efeae2] dark:bg-[#141d23]">
        {!loading &&
          messages.length > 0 &&
          messages.map((message) => (
            <Message key={message._id} message={message} />
          ))}
        {!loading && messages.length === 0 && (
          <p className="flex items-center justify-center h-full text-center text-[#8697a0] dark:text-[#aebac1]">
            Start messaging...
          </p>
        )}
        {loading && (
          <div className="flex h-full items-center justify-center">
            <div className="loading loading-spinner loading-sm text-[#8697a0] dark:text-[#aebac1]"></div>
          </div>
        )}
        <div ref={lastMessageRef}></div>
      </div>
      {/* message box */}
      <MessageBox />
    </>
  );
};

export default Chat;
