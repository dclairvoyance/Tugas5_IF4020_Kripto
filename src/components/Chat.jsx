import { useEffect, useRef } from "react";
import { MdSend } from "react-icons/md";
import dummy_avatar from "../assets/avatar.webp";
import Message from "../components/Message";

const Chat = () => {
  const lastMessageRef = useRef(null);

  useEffect(() => {
    lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleAddMessage = () => {};

  return (
    <>
      {/* header */}
      <div className="flex h-16 items-center dark:bg-[#1f2c33] border-b-2 border-[#1e2930] py-3 px-6">
        <img
          className="w-10 aspect-square my-auto object-cover rounded-full"
          src={dummy_avatar}
        />
        <div className="flex-col my-auto ml-3 w-[calc(100%-3.25rem)]">
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
      <div className="h-full overflow-y-auto p-6">
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
      <div className="flex h-28 items-center bg-[#1f2c33] px-6">
        <form
          className="flex items-center w-full mx-auto justify-between"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            id="message"
            className="bg-gray-50 text-gray-900 text-sm rounded-md w-full py-2.5 px-4 dark:bg-[#2a3942] dark:placeholder-[#83949d] dark:text-white resize-none"
            placeholder="Tulis pesan..."
          />
          <button
            className="rounded-md h-10 w-10 hover:bg-[#2a3942] ml-3"
            onClick={handleAddMessage}
          >
            <MdSend className="text-[#aebac1] w-full" size="1.5rem" />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;
