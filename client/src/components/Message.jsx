import { PropTypes } from "prop-types";
import React, { useState, useEffect } from 'react';
import useAuth from "../stores/useAuth";
import convertTime from "../utils/convertTime";
import { decryptMessage } from "../utils/ecc";

const Message = ({ message }) => {
  const { authUser } = useAuth();
  const [storedMessage, setStoredMessage] = useState("");

  const sent = message.senderId === authUser._id;
  const privateKey = JSON.parse(localStorage.getItem('user-private-key'));
  const formattedTime = convertTime(message.createdAt);

  const convertStringToArrayOfBigints = (str) => {
    const jsonString = str.replace(/\b\d+\b/g, (match) => `"${match}"`);
    const nestedArray = JSON.parse(jsonString);
    const convertToBigint = (value) => {
      if (Array.isArray(value)) {
        return value.map(convertToBigint);
      } else if (typeof value === 'string') {
        return BigInt(value);
      } else {
        throw new TypeError('Invalid element type');
      }
    };
  
    return convertToBigint(nestedArray);
  };
  
  useEffect(() => {
    if (sent) {
      const itemId = message._id;
      const item = JSON.parse(localStorage.getItem('user-message'))?.find(item => item.messageSent._id === itemId) || null;
      if (item) {
        setStoredMessage(item.messageSent.message);
      } else {
        setStoredMessage("");
      }
    } else if (message.senderId !== authUser._id) {
      const data = convertStringToArrayOfBigints(message.message);
      setStoredMessage(decryptMessage(data, BigInt(privateKey)));
    }
  }, [message]);
  return (
    <div className="flex flex-col mb-3">
      <div className={`${sent ? "justify-end" : "justify-start"} flex w-full`}>
        <p
          className={`${
            sent
              ? "bg-[#d9fdd2] dark:bg-[#015d4b]"
              : "bg-white dark:bg-[#1f2c33]"
          } flex rounded-md text-start text-sm py-2 px-3 max-w-[calc(100%-4rem)] md:max-w-[calc(100%-8rem)] w-fit mb-1`}
        >
          {storedMessage}
        </p>
      </div>
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
