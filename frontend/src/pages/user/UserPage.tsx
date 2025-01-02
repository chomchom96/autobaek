import { useParams } from "react-router-dom";
import UserStats from "@/components/user/UserStats";
import axios from "@/utils/axios";
import { useState, useEffect } from "react";

interface TagStat {
  tag: string;
  count: number;
}

interface Problem {
  problemId: string;
  tried: number;
  averageTries: number;
  tags: string[];
  _id: string;
}

interface TagCounts {
  [key: string]: number;
}

function countTags(problems: Problem[]): TagStat[] {
  const tagCounts: TagCounts = {};

  problems.forEach((problem) => {
    problem.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const tagStats: TagStat[] = Object.entries(tagCounts).map(([tag, count]) => ({
    tag,
    count,
  }));

  tagStats.sort((a, b) => b.count - a.count);

  return tagStats;
}

export default function UserPage() {
  const params = useParams();
  // 유저 찾는 api promise -> 현재 문제를 tag별로 누적합을 반환하는 api promise
  const [id, setId] = useState("");
  const [level, setLevel] = useState(0);
  const [problemSolved, setProblemSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [tagStat, setTagStat] = useState<TagStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `/user?id=${params.id}&isUserPage=true`
        );

        // console.log(response.data);
        setId(response.data.id);
        setLevel(response.data.level);
        setStreak(response.data.maxStreak);
        setProblemSolved(response.data.solvedCnt);
        setTagStat(countTags(response.data.solvedProblems));
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [params.id, error]);

  if (loading) {
    return <div className="text-white">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
        <button
          onClick={handleRetry}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

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
          <UserStats
            id={id}
            level={level}
            problemSolved={problemSolved}
            streak={streak}
            tagStats={tagStat}
          />
        </div>
      </div>
    </div>
  );
}
