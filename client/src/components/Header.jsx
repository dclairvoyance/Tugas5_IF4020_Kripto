import { MdLogout } from "react-icons/md";
import useLogout from "../hooks/useLogout";

const Header = () => {
  const { loading, logout } = useLogout();

  return (
    <div className="bg-[#f0f2f5] dark:bg-[#1f2c33] flex h-16 items-center border-b-2 border-[#f0f3f4] dark:border-[#1e2930] p-6 justify-between">
      <h1 className="text-xl font-black">Crypto Chat</h1>
      <div className="flex gap-2">
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
    </div>
  );
};

export default Header;
