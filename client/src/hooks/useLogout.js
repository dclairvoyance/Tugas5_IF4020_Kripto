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
      const storedMessages = localStorage.getItem("cc-messages") || null;
      if (storedMessages) {
        downloadKey("checkpoint.txt", storedMessages);
      }
      localStorage.removeItem("cc-user");
      localStorage.removeItem("cc-public-keys");
      localStorage.removeItem("cc-messages");
      localStorage.removeItem("cc-private-key");
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
