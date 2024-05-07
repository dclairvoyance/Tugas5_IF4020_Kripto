import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../stores/useAuth";

const useRegister = () => {
  const [loading, setLoading] = useState(false);

  const { setAuthUser } = useAuth();

  const register = async ({
    displayName,
    username,
    password,
    confirmPassword,
  }) => {
    // validate input
    const isValid = handleInput({
      displayName,
      username,
      password,
      confirmPassword,
    });
    if (!isValid) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          username,
          password,
          confirmPassword,
        }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("crypto-chat-user", JSON.stringify(data.user));
      setAuthUser(data.user);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, register };
};

export default useRegister;

const handleInput = ({ displayName, username, password, confirmPassword }) => {
  // check no empty fields
  if (!displayName || !username || !password || !confirmPassword) {
    toast.error("Please fill in all fields!");
    return false;
  }

  // check password = confirmPassword
  if (password !== confirmPassword) {
    toast.error("Passwords do not match!");
    return false;
  }

  // check password length
  if (password.length < 6) {
    toast.error("Password must be at least 6 characters!");
    return false;
  }

  return true;
};
