import { useEffect, useRef } from "react";
import { MdArrowBack } from "react-icons/md";
import { PropTypes } from "prop-types";
import dummy_avatar from "../assets/avatar.webp";
import Message from "../components/Message";
import MessageBox from "./MessageBox";
import useGetMessages from "../hooks/useGetMessages";

const Chat = ({ setChatOpen }) => {
  const lastMessageRef = useRef(null);

  const { loading, messages } = useGetMessages();

  useEffect(() => {
    lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* header */}
      <div className="flex h-16 items-center bg-[#f0f2f5] dark:bg-[#1f2c33] border-b-2 border-[#f0f3f4] dark:border-[#1e2930] py-3 px-6">
        <button
          className="md:hidden block rounded-full w-8 h-8 hover:border hover:border-[#8697a0] hover:dark:bg-[#1f2c33] bg-[#f0f2f5]"
          onClick={() => setChatOpen(false)}
        >
          <MdArrowBack
            className="text-[#8697a0] dark:text-[#aebac1] w-full"
            size="1.5rem"
          />
        </button>
        <img
          className="w-10 aspect-square my-auto object-cover rounded-full ml-3 md:ml-0"
          src={dummy_avatar}
        />
        <div className="flex-col my-auto ml-3 md:w-[calc(100%-3.25rem)] w-[calc(100%-6rem)]">
          <p className="text-start truncate text-md font-semibold">
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Assumenda a placeat expedita quibusdam, incidunt
            tenetur fugit vel veritatis nulla ad, voluptates quas id consequatur
            deserunt veniam rem dolorem, eos harum.
          </p>
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
          <p className="text-center text-[#8697a0] dark:text-[#aebac1]">
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

Chat.propTypes = {
  setChatOpen: PropTypes.func.isRequired,
};

export default Chat;
