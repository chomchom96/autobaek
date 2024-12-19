import { useParams } from "react-router-dom";
import UserStats from "@/components/user/UserStats";

export default function UserPage() {
  const params = useParams();
  const userData = {
    id: params.id || "",
    name: "이름",
    level: "29",
    problemsSolved: 500,
    streak: 250,
    tagStats: [
      { tag: "그래프 탐색", count: 50 },
      { tag: "수학", count: 40 },
      { tag: "다이나믹 프로그래밍", count: 30 },
      { tag: "트리", count: 25 },
      { tag: "누적 합", count: 20 },
      { tag: "정렬", count: 15 },
    ],
  };

  return (
    <div className="min-h-screen relative" id="bg">
      {/* <BackgroundAnimation /> */}
      <div className="relative max-w-6xl mx-auto p-4 z-10">
        <a
          href="/"
          className="text-white hover:text-blue-300 transition-colors mb-4 inline-block"
        >
          &larr; 돌아가기
        </a>
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
          <UserStats userData={userData} />
        </div>
      </div>
    </div>
  );
}

