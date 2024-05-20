import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../stores/useAuth";
import { encrypt } from "../utils/delazi";
import { stringToHex } from "../utils/helpers";

const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const { setAuthUser } = useAuth();

  const login = async ({ username, password }) => {
    // validate input
    const isValid = handleInput({
      username,
      password,
    });
    if (!isValid) return;

    setLoading(true);
    try {
      const encrypted = encrypt(
        stringToHex(JSON.stringify({ username, password })),
        import.meta.env.VITE_BLOCK_CIPHER_EXTERNAL_KEY
      );

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encrypted }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("cc-user", JSON.stringify(data.user));
      setAuthUser(data.user);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;

const handleInput = ({ username, password }) => {
  // check no empty fields
  if (!username || !password) {
    toast.error("Please fill in all fields!");
    return false;
  }

  // check password length
  if (password.length < 6) {
    toast.error("Password must be at least 6 characters!");
    return false;
  }

  return true;
};
