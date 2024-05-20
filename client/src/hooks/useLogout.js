import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../stores/useAuth";
import { downloadKey } from "../utils/downloadKey";

const useLogout = () => {
  const [loading, setLoading] = useState(false);

  const { setAuthUser } = useAuth();

  const logout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      const storedMessages = localStorage.getItem("user-message") || null;
      if(storedMessages){
        downloadKey("checkpoint.txt", storedMessages)
      }
      localStorage.removeItem("crypto-chat-user");
      localStorage.removeItem("user-private-key");
      localStorage.removeItem("user-public-key");
      localStorage.removeItem("user-message");
      setAuthUser(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;
