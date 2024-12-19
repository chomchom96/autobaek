import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function BookmarkedUsers() {
  const [bookmarkedUsers, setBookmarkedUsers] = useState<string[]>([]);

  useEffect(() => {
    const bookmarks = JSON.parse(
      localStorage.getItem("bookmarkedUsers") || "[]"
    );
    setBookmarkedUsers(bookmarks);
  }, []);

  return (
    <div className="mt-8 z-10">
      {bookmarkedUsers.length === 0 ? (
        <div className="bg-white backdrop-blur-md rounded-lg p-4 text-center">
          북마크한 사용자가 없습니다
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 z-10">
          {bookmarkedUsers.map((user) => (
            <Link
              key={user}
              to={`/user/${user}`}
              className="bg-white backdrop-blur-md rounded-lg p-4 hover:bg-opacity-30 transition-colors"
            >
              <p className="font-semibold">{user}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
