import { MdFileUpload } from "react-icons/md";
import PropTypes from "prop-types";

const FileInput = ({ handleOnChangeParent, fileName, isPublicExists }) => {
  return (
    <div className="flex-col">
      <label
        htmlFor={"upload-file" + fileName}
        className="flex w-full border border-dashed border-[#8697a0] hover:border-solid rounded-lg cursor-pointer bg-[#f0f2f5]"
      >
        <div className="flex-col w-full my-auto p-1">
          <MdFileUpload className="mx-auto" size="24" color="#8697a0" />
          <p className="text-xs whitespace-nowrap text-[#8697a0]">
            {isPublicExists ? fileName + " found" : fileName + " upload"}
          </p>
        </div>
        <input
          id={"upload-file" + fileName}
          type="file"
          className="hidden"
          onChange={handleOnChangeParent}
        />
      </label>
    </div>
  );
};

FileInput.propTypes = {
  handleOnChangeParent: PropTypes.func.isRequired,
  fileName: PropTypes.string.isRequired,
  isPublicExists: PropTypes.bool.isRequired,
};

export default FileInput;
