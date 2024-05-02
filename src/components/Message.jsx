import { PropTypes } from "prop-types";

const Message = ({ text, sent }) => {
  return (
    <div className="flex flex-col mb-3">
      <div className={`${sent ? "justify-end" : "justify-start"} flex w-full`}>
        <p
          className={`${
            sent ? "bg-[#015d4b]" : "bg-[#1f2c33]"
          } flex rounded-md text-start text-sm py-2 px-3 max-w-[calc(100%-8rem)] w-fit mb-1`}
        >
          {text}
        </p>
      </div>
      <span
        className={`${
          sent ? "text-end mr-1.5" : "text-start ml-1.5"
        } text-xs text-[#8697a0]`}
      >
        10:00
      </span>
    </div>
  );
};

Message.propTypes = {
  text: PropTypes.string.isRequired,
  sent: PropTypes.bool.isRequired,
};

export default Message;
