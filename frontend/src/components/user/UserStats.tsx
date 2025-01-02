import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  // CalendarDays,
  Award,
  BookOpen,
  Zap,
  Brain,
  TrendingUp,
  Smile,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "@/utils/axios";
import { isAxiosError } from "axios";
import TagProblemGraph from "./TagProblemGraph";
import getLevelColor from "@/utils/getLevelColor";

interface TagStat {
  tag: string;
  count: number;
}

const recommendationTypes = [
  { id: "default", name: "많이 푼 문제", icon: TrendingUp },
  { id: "topic", name: "내가 약한 문제", icon: Zap },
  { id: "progress", name: "챌린지 문제", icon: Brain },
  { id: "streak", name: "스트릭해용", icon: Smile },
];

interface Problem {
  problemId: string;
  problemTitle: string;
  difficulty: number;
  tags: string[];
}

interface ResponseDataType {
  message: string;
  code: number;
}

export default function UserStats({
  id,
  level,
  problemSolved,
  streak,
  tagStats,
}: {
  id: string;
  level: number;
  problemSolved: number;
  streak: number;
  tagStats: TagStat[];
}) {
  const [activeTab, setActiveTab] = useState("default");
  const [recommendedProblems, setRecommendedProblems] = useState<Problem[]>([]);
  // const totalProblems = tagStats.reduce((sum, stat) => sum + stat.count, 0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarkedUsers = JSON.parse(
      localStorage.getItem("bookmarkedUsers") || "[]"
    );
    setIsBookmarked(bookmarkedUsers.includes(id));
  }, []);

  const toggleBookmark = () => {
    const bookmarkedUsers = JSON.parse(
      localStorage.getItem("bookmarkedUsers") || "[]"
    );

    let newBookmarkedUsers;
    if (isBookmarked) {
      newBookmarkedUsers = bookmarkedUsers.filter((user:string) => user !== id);
    } else {
      newBookmarkedUsers = [...bookmarkedUsers, id];
    }

    localStorage.setItem("bookmarkedUsers", JSON.stringify(newBookmarkedUsers));
    setIsBookmarked(!isBookmarked);
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`/recommend`, {
          params: { type: activeTab, id },
        });
        setRecommendedProblems(response.data.recommendations);
        setErrorMessage(null);
      } catch (error) {
        if (isAxiosError<ResponseDataType>(error) && error.response) {
          if (
            error.response.data.message ===
            "User level too low for streak problems"
          ) {
            setErrorMessage(
              "사용자의 레벨이 너무 낮아 스트릭 문제를 추천할 수 없습니다."
            );
          } else {
            setErrorMessage("추천 문제를 가져오는 중 오류가 발생했습니다.");
          }
        } else {
          setErrorMessage("예기치 않은 오류가 발생했습니다.");
        }
      }
    };

    fetchRecommendations();
  }, [activeTab, id]); // activeTab과 id가 변경될 때마다 호출

  return (
    <div className="space-y-6">
      <Card className="bg-white bg-opacity-10 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">{id}</CardTitle>
          <Badge
            variant="secondary"
            className={`text-lg text-white ${getLevelColor(level).bgColor}`}
          >
            {getLevelColor(level).levelName}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span className="text-sm">푼 문제 {problemSolved}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">최대 스트릭 {streak}일</span>
            </div>
            <button
              onClick={toggleBookmark}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-6 w-6 text-blue-400" />
              ) : (
                <Bookmark className="h-6 w-6 text-gray-400" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white bg-opacity-10 text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">오늘의 문제</h2>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-4 bg-gray-100">
              {recommendationTypes.map((type) => (
                <TabsTrigger
                  key={type.id}
                  value={type.id}
                  className="flex items-center space-x-2 text-gray-700 data-[state=active]:text-blue-600"
                >
                  <type.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{type.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {recommendationTypes.map((type) => (
              <TabsContent key={type.id} value={type.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {errorMessage && (
                    <div className="text-red-500 p-4 rounded">
                      {errorMessage}
                    </div>
                  )}
                  {recommendedProblems.map((problem) => (
                    <Card key={problem.problemId} className="bg-white">
                      <CardContent
                        className="p-4"
                        onClick={() =>
                          window.open(
                            `http://acmicpc.net/problem/${problem.problemId}`
                          )
                        }
                      >
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                          {problem.problemTitle}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge
                            id={problem.problemId}
                            className={`text-white ${
                              getLevelColor(level).bgColor
                            }`}
                          >
                            {getLevelColor(problem.difficulty).levelName}
                          </Badge>
                          {problem.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-white bg-opacity-10 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            문제 풀이 현황
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 w-full h-fit mx-auto bg-white">
          <TagProblemGraph tagStats={tagStats.slice(0, 8)} />
          {/* <div className="space-y-4">
            {tagStats.map((stat) => (
              <div key={stat.tag} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{stat.tag}</span>
                  <span>
                    {stat.count} / {totalProblems}
                  </span>
                </div>
                <Progress
                  value={(stat.count / totalProblems) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div> */}
        </CardContent>
      </Card>

      <Card className="bg-white bg-opacity-10 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">도전과제</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg"
              >
                <Award className="h-8 w-8 text-yellow-400 mb-2" />
                <span className="text-sm text-center">과제{i}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
