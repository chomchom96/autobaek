import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock } from "lucide-react";
import axios from "../../utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import getLevelColor from "@/utils/getLevelColor";

// const suggestedSearches = [
//   { userId: "cym", level: 29 },
//   { userId: "user1", level: 0 },
//   { userId: "dummy1", level: 20 },
// ];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchResult, setSearchResult] = useState<[string, number][]>([]);

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setSearchHistory(history);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSearchResults = async (query: string): Promise<[]> => {
    const response = await axios.get<{ searchResult: [] }>(
      `search?user=${query}`
    );
    return response.data.searchResult;
  };

  const useSearchQuery = (query: string) => {
    return useQuery({
      queryKey: ["search", query],
      queryFn: () => fetchSearchResults(query),
      staleTime: 1000,
    });
  };

  const { data, error, isLoading } = useSearchQuery(query);

  useEffect(() => {
    if (data) {
      setSearchResult(data);
    }
  }, [data]);

  const handleHistoryClick = (item: string) => {
    setQuery(item);
  };

  // const clearSearch = () => {
  //   setQuery("");
  //   inputRef.current?.focus();
  // };

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (query) {
        const updatedHistory = [...new Set([query, ...searchHistory])];
        setSearchHistory(updatedHistory);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
        navigate(`/user/${query}`);
      }
      setIsFocused(false);
    },
    [navigate, query, searchHistory]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      setIsFocused(false);
      const updatedHistory = [...new Set([suggestion, ...searchHistory])];
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

      if (inputRef.current) {
        inputRef.current.focus();
      }
      navigate(`/user/${suggestion}`); // URL 이동
    },
    [navigate, searchHistory]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isFocused && searchResult.length > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) =>
              Math.min(prev + 1, searchResult.length - 1)
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
            break;
          case "Enter":
            if (selectedIndex >= 0) {
              handleSuggestionClick(searchResult[selectedIndex][0]);
            } else {
              if (query && searchResult[0][0] === "query")
                handleSuggestionClick(searchResult[0][0]);
              // handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }
            break;
          case "Escape":
            setIsFocused(false);
            break;
        }
      }
    },
    [handleSuggestionClick, isFocused, query, searchResult, selectedIndex]
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute -top-14 left-0 text-xl  text-white"
        id="title"
      >
        하루에 딱 한문제만{" "}
        <span className="text-yellow-300 text-4xl ml-4">
          백스트릭 BaekStreak
        </span>
      </motion.h1>

      <div className="relative">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="백준 ID로 검색하세요"
            className="w-full py-5 px-8 pr-16 rounded-full bg-white bg-opacity-20 backdrop-blur-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 text-lg"
            aria-expanded={isFocused}
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            role="combobox"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-300 transition-colors"
            aria-label="Search"
          >
            <Search className="w-6 h-6" />
          </button>
        </form>

        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full mt-2 min-h-[100px] z-20"
            >
              <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                {query.length === 0 ? (
                  <>
                    <div className="px-6 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        검색 기록
                      </h3>
                    </div>
                    {searchHistory.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        검색 기록이 없습니다
                      </div>
                    ) : (
                      <ul>
                        {searchHistory.map((item, index) => (
                          <li
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <button
                              type="button"
                              onClick={() => handleHistoryClick(item)}
                              className="w-full px-6 py-3 text-left text-gray-700 text-sm flex items-center"
                            >
                              <Clock className="w-4 h-4 mr-3 text-gray-400" />
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <div ref={dropdownRef} id="search-suggestions" role="listbox">
                    <ul className="py-2">
                      {/* {isLoading && <p>로딩중...</p>} */}
                      {!isLoading && searchResult.length === 0 && !error && (
                        <p className="text-center">검색 결과가 없습니다.</p>
                      )}
                      {error && (
                        <p className="text-center">
                          오류가 발생했습니다. 다시 시도해 주세요.
                        </p>
                      )}
                      {searchResult.map((suggestion, index) => (
                        <li
                          key={index}
                          role="option"
                          aria-selected={index === selectedIndex}
                        >
                          <button
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion[0])}
                            className={`w-full px-6 py-3 flex flex-row items-center gap-2 text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors ${
                              index === selectedIndex ? "bg-gray-50" : ""
                            }`}
                          >
                            <span className="font-lg">{suggestion[0]}</span>
                            <span
                              className={`flex items-center justify-center w-fit rounded-full font-bold text-white ${
                                getLevelColor(suggestion[1]).bgColor
                              }`}
                            >
                              <span>
                                {getLevelColor(suggestion[1]).levelName}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
