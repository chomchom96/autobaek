import BookmarkedUsers from "@/components/search/Bookmark";
import SearchBar from "../components/search/SearchBar";
import BackgroundAnimation from "@/components/search/BackgroundAnimation";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" id="bg">
      <main className="flex flex-col items-center justify-center px-4 h-fit my-auto">
        <BackgroundAnimation />
        <SearchBar />
        <BookmarkedUsers />
      </main>
    </div>
  );
}
