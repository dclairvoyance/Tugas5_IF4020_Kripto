import { PropTypes } from "prop-types";
import useAuth from "../stores/useAuth";
import convertTime from "../utils/convertTime";

const Message = ({ message }) => {
  const { authUser } = useAuth();

  const sent = message.senderId === authUser._id;

  const formattedTime = convertTime(message.createdAt);

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
          {message.message}
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
