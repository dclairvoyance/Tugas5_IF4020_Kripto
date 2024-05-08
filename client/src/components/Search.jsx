import { PropTypes } from "prop-types";
import { MdClose, MdSearch } from "react-icons/md";

const Search = ({ search, onSearchChange }) => {
  const handleSearch = (event) => {
    onSearchChange(event.target.value);
  };

  const clearSearch = () => {
    onSearchChange("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <form
      className="flex items-center w-full mx-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <MdSearch className="dark:text-[#8697a0]" />
        </div>
        <input
          type="text"
          id="search"
          className="h-9 bg-[#f0f2f5] text-gray-900 text-sm rounded-md w-full ps-[3.25rem] p-1.5 dark:bg-[#1f2c33] dark:placeholder-[#8697a0] dark:text-white"
          placeholder="Cari teman..."
          value={search}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 end-2 w-6 h-6 my-auto rounded-full hover:border hover:border-[#8697a0] hover:dark:bg-[#1f2c33]"
            aria-label="Clear search"
            tabIndex={0}
          >
            <MdClose className="dark:text-[#8697a0] mx-auto" />
          </button>
        )}
      </div>
    </form>
  );
};

Search.propTypes = {
  search: PropTypes.string,
  onSearchChange: PropTypes.func,
};

export default Search;
