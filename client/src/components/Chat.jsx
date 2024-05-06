import { useEffect, useRef } from "react";
import { MdArrowBack, MdSend } from "react-icons/md";
import { PropTypes } from "prop-types";
import dummy_avatar from "../assets/avatar.webp";
import Message from "../components/Message";

const Chat = ({ setChatOpen }) => {
  const lastMessageRef = useRef(null);

  useEffect(() => {
    lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleBack = () => {
    setChatOpen(false);
  };

  const handleAddMessage = () => {};

  return (
    <>
      {/* header */}
      <div className="flex h-16 items-center bg-[#f0f2f5] dark:bg-[#1f2c33] border-b-2 border-[#f0f3f4] dark:border-[#1e2930] py-3 px-6">
        <button
          className="md:hidden block rounded-full w-8 h-8 hover:border hover:border-[#8697a0] hover:dark:bg-[#1f2c33] bg-[#f0f2f5]"
          onClick={handleBack}
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
          <p className="text-start truncate text-xs text-[#8697a0]">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam
            dolorum eligendi officiis sed voluptatem natus. Pariatur quae animi
            nobis, porro vitae cumque ex, atque minima distinctio doloremque
            cupiditate modi consequuntur!
          </p>
        </div>
      </div>
      {/* messages */}
      <div className="h-full overflow-y-auto p-6 bg-[#efeae2] dark:bg-[#141d23]">
        <Message text="chat" sent={true} />
        <Message
          text="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam
                dolorum eligendi officiis sed voluptatem natus. Pariatur quae
                animi nobis, porro vitae cumque ex, atque minima distinctio
                doloremque cupiditate modi consequuntur!"
          sent={false}
        />
        <Message
          text="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam
                dolorum eligendi officiis sed voluptatem natus. Pariatur quae
                animi nobis, porro vitae cumque ex, atque minima distinctio
                doloremque cupiditate modi consequuntur!"
          sent={false}
        />
        <Message
          text="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam
                dolorum eligendi officiis sed voluptatem natus. Pariatur quae
                animi nobis, porro vitae cumque ex, atque minima distinctio
                doloremque cupiditate modi consequuntur!"
          sent={false}
        />
        <Message
          text="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam
                dolorum eligendi officiis sed voluptatem natus. Pariatur quae
                animi nobis, porro vitae cumque ex, atque minima distinctio
                doloremque cupiditate modi consequuntur!"
          sent={false}
        />
        <div ref={lastMessageRef}></div>
      </div>
      {/* message box */}
      <div className="flex h-28 items-center bg-[#f0f2f5] dark:bg-[#1f2c33] px-6">
        <form
          className="flex items-center w-full mx-auto justify-between"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            id="message"
            className="bg-white text-gray-900 text-sm rounded-md w-full py-2.5 px-4 dark:bg-[#2a3942] dark:placeholder-[#83949d] dark:text-white resize-none"
            placeholder="Tulis pesan..."
          />
          <button
            className="rounded-md h-10 w-10 bg-[#f0f2f5] dark:bg-[#1f2c33] hover:border hover:border-[#8697a0] hover:dark:bg-[#2a3942] ml-3"
            onClick={handleAddMessage}
          >
            <MdSend
              className="text-[#8697a0] dark:text-[#aebac1] w-full"
              size="1.5rem"
            />
          </button>
        </form>
      </div>
    </>
  );
};

Chat.propTypes = {
  setChatOpen: PropTypes.func.isRequired,
};

export default Chat;
