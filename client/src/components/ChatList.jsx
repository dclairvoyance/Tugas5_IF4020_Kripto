import { MdSearch } from "react-icons/md";
import Header from "./Header";
import useGetChats from "../hooks/useGetChats";
import ChatItem from "./ChatItem";

const ChatList = () => {
  const { loading, chats } = useGetChats();

  return (
    <>
      <Header />
      {/* search */}
      <div className="flex h-12 items-center border-b-2 border-[#f0f3f4] dark:border-[#1e2930] px-3">
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
              className="bg-[#f0f2f5] text-gray-900 text-sm rounded-md w-full ps-[3.25rem] p-1.5 dark:bg-[#1f2c33] dark:placeholder-[#8697a0] dark:text-white"
              placeholder="Cari teman..."
              required
            />
          </div>
        </form>
      </div>
      {/* chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <ChatItem key={chat._id} chat={chat} />
        ))}
        {!loading ? null : (
          <div className="mx-auto h-full loading loading-spinner loading-md text-[#8697a0] dark:text-[#aebac1]"></div>
        )}
      </div>
    </>
  );
};

export default ChatList;
