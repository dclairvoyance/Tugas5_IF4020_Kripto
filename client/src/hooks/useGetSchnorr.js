import { useState } from "react";
import toast from "react-hot-toast";
import useChat from "../stores/useChat";

const useGetSchnorr = () => {
  const [loading, setLoading] = useState(false);

  const { setSchnorr } = useChat();

  const getSchnorr = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages/schnorr");
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setSchnorr(data.schnorr);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getSchnorr };
};

export default useGetSchnorr;
