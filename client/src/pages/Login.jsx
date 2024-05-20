import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const { loading, login } = useLogin();

  const handleKeyChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result;
        localStorage.setItem("cc-private-key", JSON.stringify(content));
      };

      reader.onerror = () => {
        console.error("Error reading file.");
      };

      reader.readAsText(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const content = JSON.parse(reader.result);
        localStorage.setItem("cc-messages", JSON.stringify(content));
      };

      reader.onerror = () => {
        console.error("Error reading file.");
      };

      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(input);
  };

  return (
    <div className="flex flex-col items-center mx-auto max-w-[24rem] w-full my-auto p-6 bg-white rounded-md border border-[#1e2930]">
      <h1 className="font-semibold text-2xl text-black">Welcome back!</h1>
      <form className="flex flex-col w-full mt-6" onSubmit={handleSubmit}>
        <label
          htmlFor="username"
          className="text-sm font-bold text-start text-gray-600"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md p-3 mt-1.5 mb-3"
          placeholder="Username"
          value={input.username}
          onChange={(e) => setInput({ ...input, username: e.target.value })}
        />
        <label
          htmlFor="password"
          className="text-sm font-bold text-start text-gray-600"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md p-3 mt-1.5 mb-3"
          placeholder="Password"
          value={input.password}
          onChange={(e) => setInput({ ...input, password: e.target.value })}
        />
        <p className="text-sm font-bold text-start text-gray-600">
          Private Key
        </p>
        <input className="mt-1.5 mb-3" type="file" onChange={handleKeyChange} />
        <p className="text-sm font-bold text-start text-gray-600">
          Chat History
        </p>
        <input
          className="mt-1.5 mb-3"
          type="file"
          onChange={handleFileChange}
        />
        <button
          className="flex items-center justify-center bg-[#015d4b] rounded-md p-3  mb-2 font-semibold"
          disabled={loading}
        >
          {!loading ? (
            <span className="text-white">Login</span>
          ) : (
            <span className="loading loading-spinner loading-sm text-[#8697a0] dark:text-[#aebac1]"></span>
          )}
        </button>
        <div className="flex mx-auto gap-1">
          <p className="text-sm text-gray-600">Don&apos;t have an account? </p>
          <Link
            to="/register"
            className="text-sm text-[#015d4b] cursor-pointer"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
