import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Search } from "lucide-react";

const suggestedSearches = [
  { userId: "cym", level: 29 },
  { userId: "user1", level: 0 },
  { userId: "dummy1", level: 20 },
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("query:", query);
    setIsFocused(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsFocused(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isFocused) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prevIndex) =>
            prevIndex < suggestedSearches.length - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
          break;
        case "Enter":
          if (selectedIndex >= 0) {
            e.preventDefault();
            handleSuggestionClick(suggestedSearches[selectedIndex].userId);
          }
          break;
        case "Escape":
          setIsFocused(false);
          setSelectedIndex(-1);
          break;
      }
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search the web..."
          className="w-full py-4 px-6 pr-12 rounded-full bg-white bg-opacity-20 backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
          aria-expanded={isFocused}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          role="combobox"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-blue-400 transition-colors"
          aria-label="Search"
        >
          <Search className="w-6 h-6" />
        </button>
        {isFocused && (
          <div
            ref={dropdownRef}
            id="search-suggestions"
            className="absolute mt-2 w-full bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden z-10"
            role="listbox"
          >
            <ul className="py-2">
              {suggestedSearches.map((suggestion, index) => (
                <li
                  key={index}
                  role="option"
                  aria-selected={index === selectedIndex}
                >
                  <button
                    onClick={() => handleSuggestionClick(suggestion.userId)}
                    className={`w-full px-4 py-2 text-left text-gray-800 hover:bg-blue-100 focus:bg-blue-100 focus:outline-none transition-colors ${
                      index === selectedIndex ? "bg-blue-100" : ""
                    }`}
                  >
                    {/* TODO : level icon */}
                    {suggestion.userId + " " + suggestion.level}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
