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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `/user?id=${params.id}&isUserPage=true`
        );
        setId(response.data.id);
        setLevel(response.data.level);
        setStreak(response.data.maxStreak);
        setProblemSolved(response.data.solvedCnt);
        setTagStat(countTags(response.data.solvedProblem));
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [params.id]);

  if (loading) {
    return <div className="text-white">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-500">오류가 발생했습니다</div>;
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
