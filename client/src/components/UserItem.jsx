import { PropTypes } from "prop-types";
import dummy_avatar from "../assets/avatar.webp";
import useChat from "../stores/useChat";
import useWindow from "../stores/useWindow";

const UserItem = ({ user }) => {
  const { selectedChat, setSelectedChat, setNewChat } = useChat();
  const { setChatOpen } = useWindow();

  const isSelected = selectedChat?._id === user._id;

  return (
    <div
      className={`${
        isSelected ? "bg-[#f0f2f5] dark:bg-[#1f2c33]" : ""
      } hover:bg-[#f0f2f5] hover:dark:bg-[#1f2c33] flex p-3 overflow-x-auto cursor-pointer border-b-2 border-[#f0f3f4] dark:border-[#1e2930] h-[4.5rem]`}
      onClick={() => {
        setSelectedChat(user);
        setNewChat(true);
        setChatOpen(true);
      }}
    >
      <img
        className="w-10 aspect-square my-auto object-cover rounded-full"
        src={user.profilePicture || dummy_avatar}
      />
      <div className="flex-col my-auto ml-3 w-[calc(100%-3.25rem)]">
        <p className="text-start truncate mr-3 text-md font-semibold">
          {user.displayName}
        </p>
      </div>
    </div>
  );
};

UserItem.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    displayName: PropTypes.string,
    username: PropTypes.string,
    profilePicture: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
};

export default UserItem;
