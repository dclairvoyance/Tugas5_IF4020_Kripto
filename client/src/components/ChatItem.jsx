import dummy_avatar from "../assets/avatar.webp";
import useChat from "../stores/useChat";
import useWindow from "../stores/useWindow";

const ChatItem = ({ chat }) => {
  const { selectedChat, setSelectedChat } = useChat();
  const { setChatOpen } = useWindow();

  const isSelected = selectedChat?._id === chat._id;

  return (
    <div
      className={`${
        isSelected ? "bg-[#f0f2f5] dark:bg-[#1f2c33]" : ""
      } hover:bg-[#f0f2f5] hover:dark:bg-[#1f2c33] flex p-3 overflow-x-auto cursor-pointer border-b-2 border-[#f0f3f4] dark:border-[#1e2930] h-[4.5rem]`}
      onClick={() => {
        setSelectedChat(chat);
        setChatOpen(true);
      }}
    >
      <img
        className="w-10 aspect-square my-auto object-cover rounded-full"
        src={chat.profilePicture || dummy_avatar}
      />
      <div className="flex-col my-auto ml-3 w-[calc(100%-3.25rem)]">
        <div className="flex justify-between">
          <p className="text-start truncate mr-3 text-md font-semibold">
            {chat.displayName}
          </p>
          <span className="flex text-xs items-center text-[#8697a0]">
            10:00
          </span>
        </div>
        <p className="text-start truncate text-xs text-[#8697a0]">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam
          dolorum eligendi officiis sed voluptatem natus. Pariatur quae animi
          nobis, porro vitae cumque ex, atque minima distinctio doloremque
          cupiditate modi consequuntur!
        </p>
      </div>
    </div>
  );
};

export default ChatItem;
