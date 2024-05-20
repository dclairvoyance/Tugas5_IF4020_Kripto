import { useState } from "react";
import { Link } from "react-router-dom";
import useRegister from "../hooks/useRegister";

const Register = () => {
  const [input, setInput] = useState({
    displayName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const { loading, register } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(input);
  };

  return (
    <div className="flex flex-col items-center mx-auto max-w-[24rem] w-full my-auto p-6 bg-white rounded-md border border-[#1e2930]">
      <h1 className="font-semibold text-2xl text-black">Create an account!</h1>
      <form className="flex flex-col w-full mt-6" onSubmit={handleSubmit}>
        <label
          htmlFor="displayName"
          className="text-sm font-bold text-start text-gray-600"
        >
          Display Name
        </label>
        <input
          type="text"
          id="displayName"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md p-3 mt-1.5 mb-3"
          placeholder="Bang Jago"
          value={input.displayName}
          onChange={(e) => setInput({ ...input, displayName: e.target.value })}
        />
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
          placeholder="bangjago"
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
          placeholder="******"
          value={input.password}
          onChange={(e) => setInput({ ...input, password: e.target.value })}
        />
        <label
          htmlFor="confirmPassword"
          className="text-sm font-bold text-start text-gray-600"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md p-3 mt-1.5 mb-6"
          placeholder="******"
          value={input.confirmPassword}
          onChange={(e) =>
            setInput({ ...input, confirmPassword: e.target.value })
          }
        />
        <button
          className="flex items-center justify-center bg-[#015d4b] rounded-md p-3 mb-2 font-semibold"
          disabled={loading}
        >
          {!loading ? (
            <span className="text-white">Register</span>
          ) : (
            <span className="loading loading-spinner loading-sm text-[#8697a0] dark:text-[#aebac1]"></span>
          )}
        </button>
        <div className="flex mx-auto gap-1">
          <p className="text-sm text-gray-600">Have an account? </p>
          <Link to="/login" className="text-sm text-[#015d4b] cursor-pointer">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
