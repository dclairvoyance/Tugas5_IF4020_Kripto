import { useState } from "react";
import "./App.css";
import ChatList from "./components/ChatList";
import Chat from "./components/Chat";

function App() {
  const [chatOpen, setChatOpen] = useState(true);
  const [account, setAccount] = useState(false);
  const [haveAccount, setHaveAccount] = useState(true);

  return (
    <>
      <div className="flex w-[90vw] h-[90vh] border border-[#1e2930] rounded-md">
        {account ? (
          <>
            <div
              className={`w-full md:w-1/3 flex flex-col border-r-2 border-[#1e2930] ${
                chatOpen ? "hidden md:block" : "block"
              }`}
            >
              <ChatList />
            </div>
            <div
              className={`w-full md:w-2/3 flex flex-col ${
                chatOpen ? "block" : "hidden md:block"
              }`}
            >
              <Chat />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center mx-auto max-w-[24rem] w-full my-auto p-6 bg-white rounded-md border border-[#1e2930]">
              <h1 className="font-semibold text-2xl text-black">
                {haveAccount ? "Login" : "Register"}
              </h1>
              <form
                className="flex flex-col w-full mt-4 gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md p-3"
                  placeholder="Username"
                  required
                />
                <input
                  type="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md p-3"
                  placeholder="Password"
                  required
                />
                <button className="bg-[#015d4b] rounded-md p-3 font-semibold">
                  {haveAccount ? "Login" : "Register"}
                </button>
                <div className="flex mx-auto gap-1">
                  <p className="text-sm text-gray-600">
                    {haveAccount
                      ? "Don't have an account?"
                      : "Have an account? "}
                  </p>
                  <p
                    onClick={() => setHaveAccount(!haveAccount)}
                    className="text-sm text-[#015d4b] cursor-pointer"
                  >
                    {haveAccount ? "Register" : "Login"}
                  </p>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
