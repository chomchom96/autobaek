/* eslint-disable react-refresh/only-export-components */
import UserStats from "../../components/user/UserStats";

export default function UserPage({ params }: { params: { id: string } }) {
  const userData = {
    id: params.id,
    name: "이름",
    level: "29",
    problemsSolved: 500,
    streak: 250,
    tagStats: [
      { tag: "Arrays", count: 50 },
      { tag: "Strings", count: 40 },
      { tag: "Dynamic Programming", count: 30 },
      { tag: "Trees", count: 25 },
      { tag: "Graphs", count: 20 },
      { tag: "Sort", count: 15 },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        <a
          href="/"
          className="text-white hover:text-blue-300 transition-colors mb-4 inline-block"
        >
          &larr; Back
        </a>
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-6">User Statistics</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserStats userData={userData} />
          </div>
        </div>
      </div>
    </div>
  );
}
