import Header from "./Header";
import useGetChats from "../hooks/useGetChats";
import useGetUsers from "../hooks/useGetUsers";
import ChatItem from "./ChatItem";
import UserItem from "./UserItem";
import Search from "./Search";
import { useEffect, useState } from "react";

const ChatList = () => {
  const [search, setSearch] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { loading: loadingChats, chats } = useGetChats();
  const { loading: loadingUsers, users, getUsers } = useGetUsers();

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
    </>
  );
};

export default ChatList;
