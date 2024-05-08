import { useState } from "react";
import toast from "react-hot-toast";

const useGetUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const getUsers = async (search) => {
    setLoading(true);
    try {
      const url = new URL("http://localhost:5000/api/users");
      url.search = new URLSearchParams({ search });
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setUsers(data.users);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, users, getUsers };
};

export default useGetUsers;
