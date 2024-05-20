import Header from "./Header";
import useGetChats from "../hooks/useGetChats";
import useGetUsers from "../hooks/useGetUsers";
import ChatItem from "./ChatItem";
import UserItem from "./UserItem";
import Search from "./Search";
import { useEffect, useState } from "react";
import useAuth from "../stores/useAuth";
import dummy_avatar from "../assets/avatar.webp";
import useLogout from "../hooks/useLogout";
import { MdLogout } from "react-icons/md";

const ChatList = () => {
  const [search, setSearch] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { authUser } = useAuth();
  const { loading: loadingChats, chats } = useGetChats();
  const { loading: loadingUsers, users, getUsers } = useGetUsers();
  const { loading, logout } = useLogout();

  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) => !filteredChats.some((chat) => chat._id === user._id)
      )
    );
  }, [filteredChats, users]);

  const handleSearch = (newSearch) => {
    setSearch(newSearch);
    getUsers(newSearch);
    if (newSearch) {
      setFilteredChats(
        chats.filter((chat) =>
          chat.displayName.toLowerCase().includes(newSearch.toLowerCase())
        )
      );
    } else {
      setFilteredChats(chats);
    }
  };

  return (
    <>
      <Header />
      {/* search */}
      <div className="flex h-[4rem] items-center border-b-2 border-[#f0f3f4] dark:border-[#1e2930] px-3">
        <Search search={search} onSearchChange={handleSearch} />
      </div>
      {/* chat list */}
      <div className="flex-1 overflow-y-auto">
        {!loadingChats && filteredChats.length > 0 && (
          <div className="flex px-4 pt-4 pb-2 text-[#015d4b] dark:text-[#027d67] border-b-2 border-[#f0f3f4] dark:border-[#1e2930] font-medium">
            CHATS
          </div>
        )}
        {!loadingChats &&
          filteredChats.map((chat) => <ChatItem key={chat._id} chat={chat} />)}
        {loadingChats && (
          <div className="mx-auto my-6 loading loading-spinner loading-md text-[#8697a0] dark:text-[#aebac1]"></div>
        )}
        {!loadingUsers && filteredUsers.length > 0 && (
          <div className="flex px-4 pt-4 pb-2 text-[#015d4b] dark:text-[#027d67] border-b-2 border-[#f0f3f4] dark:border-[#1e2930] font-medium">
            ADD FRIENDS
          </div>
        )}
        {!loadingUsers &&
          filteredUsers.map((user) => <UserItem key={user._id} user={user} />)}
        {loadingUsers && (
          <div className="mx-auto my-6 loading loading-spinner loading-md text-[#8697a0] dark:text-[#aebac1]"></div>
        )}
      </div>
      {/* search */}
      <div className="flex h-16 items-center bg-[#f0f2f5] dark:bg-[#1f2c33] border-b-2 border-[#f0f3f4] dark:border-[#1e2930] p-3">
        <img
          className="w-10 aspect-square my-auto object-cover rounded-full ml-3 md:ml-0"
          src={authUser.profilePicture || dummy_avatar}
        />
        <div className="flex my-auto ml-3 md:w-[calc(100%-5rem)] w-[calc(100%-6rem)]">
          <p className="text-start truncate text-md font-semibold">
            {authUser.displayName}
          </p>
        </div>
        <div className="flex items-center justify-center rounded-full w-8 h-8 hover:border hover:border-[#8697a0] hover:dark:bg-[#1f2c33] bg-[#f0f2f5] dark:bg-[#1f2c33]">
          {!loading ? (
            <MdLogout
              className="text-[#8697a0] dark:text-[#aebac1] w-full"
              size="1.25rem"
              onClick={logout}
            />
          ) : (
            <div className="loading loading-spinner loading-sm text-[#8697a0] dark:text-[#aebac1]"></div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatList;
