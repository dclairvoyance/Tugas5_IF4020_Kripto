import { PropTypes } from "prop-types";
import { PiSignature, PiSignatureFill } from "react-icons/pi";
import { useState, useEffect } from "react";
import useAuth from "../stores/useAuth";
import convertTime from "../utils/convertTime";
import { decryptMessage } from "../utils/ecc";

const Message = ({ message }) => {
  const { authUser } = useAuth();

  const [storedMessage, setStoredMessage] = useState("");
  const [isSignature, setIsSignature] = useState(false);
  const [isVerify, setIsVerify] = useState(false);

  const sent = message.senderId === authUser._id;
  const privateKey = JSON.parse(localStorage.getItem("cc-private-key"));
  const formattedTime = convertTime(message.createdAt);

  const convertStringToArrayOfBigints = (str) => {
    const jsonString = str.replace(/\b\d+\b/g, (match) => `"${match}"`);
    const jsonArray = JSON.parse(jsonString);
    const convertToBigint = (value) => {
      if (Array.isArray(value)) {
        return value.map(convertToBigint);
      } else if (typeof value === "string") {
        return BigInt(value);
      } else {
        throw new TypeError("Invalid element type");
      }
    };

    return convertToBigint(jsonArray);
  };

  useEffect(() => {
    if (sent) {
      const item =
        JSON.parse(localStorage.getItem("cc-messages"))?.find(
          (item) => item._id === message._id
        ) || null;
      if (item) {
        setStoredMessage(item.message);
      } else {
        setStoredMessage("<failed to fetch old message>");
      }
    } else {
      const data = convertStringToArrayOfBigints(message.message);
      const decrypted = decryptMessage(data, BigInt(privateKey));
      setStoredMessage(decrypted);
      const newMessage = { ...message, message: decrypted };
      const storedMessages =
        JSON.parse(localStorage.getItem("cc-messages")) || [];
      const newStoredMessage = [...storedMessages, newMessage];
      localStorage.setItem("cc-messages", JSON.stringify(newStoredMessage));
    }
  }, [message]);

  return (
    <div className="flex flex-col mb-3">
      <div
        className={`${
          sent ? "justify-end" : "justify-start"
        } flex w-full items-center`}
      >
        <p
          className={`${
            sent
              ? "bg-[#d9fdd2] dark:bg-[#015d4b]"
              : "bg-white dark:bg-[#1f2c33]"
          } flex rounded-md text-start text-sm py-2 px-3 max-w-[calc(100%-4rem)] md:max-w-[calc(100%-8rem)] w-fit mb-1`}
        >
          {storedMessage}
        </p>
        {!sent && (
          <div
            className={`${
              isSignature ? "border border-[#8697a0]" : ""
            } ml-2 cursor-pointer hover:border hover:border-[#8697a0] hover:dark:bg-[#1f2c33]rounded-md bg-white rounded-md h-6 w-6 flex items-center justify-center`}
          >
            <PiSignature
              size={18}
              onClick={() => setIsSignature(!isSignature)}
            />
          </div>
        )}
        {!sent && (
          <div
            className={`${
              isVerify ? "border border-[#8697a0]" : ""
            } ml-2 cursor-pointer hover:border hover:border-[#8697a0] hover:dark:bg-[#1f2c33]rounded-md bg-white rounded-md h-6 w-6 flex items-center justify-center`}
          >
            <PiSignatureFill size={24} onClick={() => setIsVerify(!isVerify)} />
          </div>
        )}
      </div>
      {!sent && isSignature && (
        <div className="flex gap-1 mb-1 ml-1.5 mt-0.5">
          <span className="font-semibold text-xs text-start w-fit">
            Signature:
          </span>
          <span className="text-xs text-start w-fit">signature here</span>
        </div>
      )}
      {!sent && isVerify && (
        <div
          className={`${
            isSignature ? "mt-0" : "mt-0.5"
          } flex gap-1 mb-1 ml-1.5`}
        >
          <span className="font-semibold text-xs text-start w-fit">
            Verify:
          </span>
          <span className="text-xs text-start w-fit">verify here</span>
        </div>
      )}
      <span
        className={`${
          sent ? "text-end mr-1.5" : "text-start ml-1.5"
        } text-xs text-[#8697a0]`}
      >
        {formattedTime}
      </span>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    _id: PropTypes.string,
    senderId: PropTypes.string,
    receiverId: PropTypes.string,
    message: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
};

export default Message;
