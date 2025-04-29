import React, { memo, useState } from "react";
import useProvideHooks from "../../hooks/useProvideHooks";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useApiSubmit from "./../../hooks/useApiSubmit";

const Search = () => {
  const { Button, apis } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

    const response = await apiSubmit({
      url: apis().getProductsBySearch.url,
      method: apis().getProductsBySearch.method,
      query: { query },
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Searching...",
    });

    if (response?.data) {
      navigate(`/search-results?query=${query}`, {
        state: { results: response?.data },
      });
    }
  };

  return (
    <div className="w-[100%] h-12 bg-[#e5e5e5] rounded-md relative py-2 flex items-center">
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-full h-9 focus:outline-none bg-inherit p-2 text-base placeholder:text-secondary"
      />
      <Button
        className="!absolute top-1 right-1 z-50 !min-w-10 !w-10 !h-10 !rounded-full !text-primary !text-xl"
        onClick={handleSearch}
      >
        <IoSearch className="text-secondary" />
      </Button>
    </div>
  );
};

export default memo(Search);
