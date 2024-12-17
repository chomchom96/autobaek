import SearchBar from "../components/search/SearchBar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4">
        <SearchBar />
      </main>
    </div>
  );
}
