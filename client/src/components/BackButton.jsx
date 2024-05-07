import { MdArrowBack } from "react-icons/md";
import useWindow from "../stores/useWindow";
import useChat from "../stores/useChat";

const BackButton = () => {
  const { setSelectedChat } = useChat();
  const { setChatOpen } = useWindow();

  return (
    <button
      className="md:hidden block rounded-full w-8 h-8 hover:border hover:border-[#8697a0] hover:dark:bg-[#1f2c33] bg-[#f0f2f5]"
      onClick={() => {
        setChatOpen(false);
        setSelectedChat(null);
      }}
    >
      <MdArrowBack
        className="text-[#8697a0] dark:text-[#aebac1] w-full"
        size="1.5rem"
      />
    </button>
  );
};

export default BackButton;
