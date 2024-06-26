import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../stores/useAuth";
import { encrypt } from "../utils/delazi";
import { generatePublicKey, generatePrivateKey } from "../utils/ecc";
import { downloadKey } from "../utils/downloadKey";
import { stringToHex } from "../utils/helpers";

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
      const encrypted = encrypt(
        stringToHex(
          JSON.stringify({
            displayName,
            username,
            password,
            confirmPassword,
          })
        ),
        import.meta.env.VITE_BLOCK_CIPHER_EXTERNAL_KEY
      );

      const res = await fetch("/api/auth/register", {
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
      let privateKey = generatePrivateKey();
      let publicKey = generatePublicKey(privateKey);
      localStorage.setItem(
        "cc-private-key",
        JSON.stringify(privateKey.toString())
      );
      downloadKey(username + ".ecpub", publicKey);
      downloadKey(username + ".ecprv", privateKey);
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
