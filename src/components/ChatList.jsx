import dummy_avatar from "../assets/avatar.webp";
import { MdSearch, MdAdd } from "react-icons/md";

const ChatList = () => {
  const handleAddChat = () => {};

  return (
    <>
      {/* header */}
      <div className="flex h-16 items-center border-b-2 border-[#1e2930] px-6 justify-between">
        <h1 className="text-xl font-black">Crypto Chat</h1>
        <button
          className="rounded-full w-8 h-8 hover:bg-[#1f2c33]"
          onClick={handleAddChat}
        >
          <MdAdd className="text-[#aebac1] w-full" size="1.5rem" />
        </button>
      </div>
      {/* search */}
      <div className="flex h-12 items-center border-b-2 border-[#1e2930] px-3">
        <form
          className="flex items-center w-full mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <MdSearch className="dark:text-[#8697a0]" />
            </div>
            <input
              type="text"
              id="search"
              className="bg-gray-50 text-gray-900 text-sm rounded-md w-full ps-[3.25rem] p-1.5 dark:bg-[#1f2c33] dark:placeholder-[#8697a0] dark:text-white"
              placeholder="Cari teman..."
              required
            />
          </div>
        </form>
      </div>
      {/* chat list */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex p-3 overflow-x-auto border-b-2 border-[#1e2930] h-[4.5rem]">
          <img
            className="w-10 aspect-square my-auto object-cover rounded-full"
            src={dummy_avatar}
          />
          <div className="flex-col my-auto ml-3 w-[calc(100%-3.25rem)]">
            <div className="flex justify-between">
              <p className="text-start truncate mr-3 text-md font-semibold">
                Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
                consectetur adipisicing elit. Assumenda a placeat expedita
                quibusdam, incidunt tenetur fugit vel veritatis nulla ad,
                voluptates quas id consequatur deserunt veniam rem dolorem, eos
                harum.
              </p>
              <span className="flex text-xs items-center text-[#8697a0]">
                10:00
              </span>
            </div>
            <p className="text-start truncate text-xs text-[#8697a0]">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam
              dolorum eligendi officiis sed voluptatem natus. Pariatur quae
              animi nobis, porro vitae cumque ex, atque minima distinctio
              doloremque cupiditate modi consequuntur!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatList;