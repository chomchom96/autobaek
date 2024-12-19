import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock } from "lucide-react";

const suggestedSearches = [
  { userId: "cym", level: 29 },
  { userId: "user1", level: 0 },
  { userId: "dummy1", level: 20 },
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleHistoryClick = (item: string) => {
    setQuery(item);
  };

  // const clearSearch = () => {
  //   setQuery("");
  //   inputRef.current?.focus();
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("query:", query);
    setIsFocused(false);
  };

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setIsFocused(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isFocused && suggestedSearches.length > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) =>
              Math.min(prev + 1, suggestedSearches.length - 1)
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
            break;
          case "Enter":
            if (selectedIndex >= 0) {
              handleSuggestionClick(suggestedSearches[selectedIndex].userId);
            }
            break;
          case "Escape":
            setIsFocused(false);
            break;
        }
      }
    },
    [handleSuggestionClick, isFocused, selectedIndex]
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute -top-14 left-0 text-3xl font-bold text-white"
        id="title"
      >
        하루에 딱 한문제만 <span className="text-yellow-300">"서비스명"</span>
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
                      {suggestedSearches.map((suggestion, index) => (
                        <li
                          key={index}
                          role="option"
                          aria-selected={index === selectedIndex}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleSuggestionClick(suggestion.userId)
                            }
                            className={`w-full px-6 py-3 text-left text-gray-800 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                              index === selectedIndex ? "bg-gray-50" : ""
                            }`}
                          >
                            <span className="font-medium">
                              {suggestion.userId}
                            </span>
                            <span
                              className={`ml-2 px-2 py-1 rounded-full text-xs ${getLevelColor(
                                suggestion.level
                              )}`}
                            >
                              {suggestion.level}
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

function getLevelColor(level: number) {
  return level > 29
    ? "bg-yellow-100 text-yellow-800"
    : level > 20
    ? "bg-gray-100 text-gray-800"
    : level > 10
    ? "bg-blue-100 text-blue-800"
    : "bg-gray-100 text-gray-800";
}
