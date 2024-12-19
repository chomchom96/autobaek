import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Award,
  BookOpen,
  Zap,
  Brain,
  TrendingUp,
  Smile,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TagStat {
  tag: string;
  count: number;
}

interface UserData {
  id: string;
  name: string;
  level: string;
  problemsSolved: number;
  streak: number;
  tagStats: TagStat[];
}

const recommendationTypes = [
  { id: "많이 푼 문제", name: "많이 푼 문제", icon: TrendingUp },
  { id: "내가 약한 문제", name: "내가 약한 문제", icon: Zap },
  { id: "챌린지 문제", name: "챌린지 문제", icon: Brain },
  { id: "스트릭해용", name: "스트릭해용", icon: Smile },
];

const mockProblems = [
  {
    id: 1001,
    title: "A+B",
    difficulty: 1,
    tags: ["구현", "사칙문제"],
  },
  {
    id: 1002,
    title: "터렛",
    difficulty: 8,
    tags: ["기하학", "수학"],
  },
  {
    id: 1003,
    title: "유기농 배추",
    difficulty: 13,
    tags: ["그래프 이론", "너비 우선 탐색"],
  },
  {
    id: 1004,
    title: "다이아몬드 광산",
    difficulty: 16,
    tags: ["다이나믹 프로그래밍", "누적 합"],
  },
];

export default function UserStats({ userData }: { userData: UserData }) {
  const [activeTab, setActiveTab] = useState("skill-based");
  const totalProblems = userData.tagStats.reduce(
    (sum, stat) => sum + stat.count,
    0
  );

  return (
    <div className="space-y-6">
      <Card className="bg-white bg-opacity-10 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">{userData.name}</CardTitle>
          <Badge variant="secondary" className="text-lg">
            Level {userData.level}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span className="text-sm">푼 문제 {userData.problemsSolved}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">스트릭 {userData.streak}일</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4 text-green-400" />
              <span className="text-sm">시작일 2023-01-01</span>
            </div>
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
                  {mockProblems.map((problem) => (
                    <Card key={problem.id} className="bg-white">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                          {problem.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge
                            variant={
                              problem.difficulty < 8
                                ? "default"
                                : problem.difficulty < 13
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {problem.difficulty}
                          </Badge>
                          {problem.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {/* <p className="text-sm text-gray-600">
                          추천 기준 : {" "}
                          {type.name.toLowerCase()} profile.
                        </p> */}
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
        <CardContent>
          <div className="space-y-4">
            {userData.tagStats.map((stat) => (
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
          </div>
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
