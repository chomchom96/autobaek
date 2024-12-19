import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Zap, Smile } from "lucide-react";

const recommendationTypes = [
  { id: "많이 푼 문제", name: "많이 푼 문제", icon: TrendingUp },
  { id: "내가 약한 문제", name: "내가 약한 문제", icon: Zap },
  { id: "챌린지 문제", name: "챌린 문제", icon: Brain },
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

export default function ProblemRecommendations() {
  const [activeTab, setActiveTab] = useState("skill-based");

  return (
    <Card className="bg-white bg-opacity-10 text-white">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Problem Recommendations</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            {recommendationTypes.map((type) => (
              <TabsTrigger
                key={type.id}
                value={type.id}
                className="flex items-center space-x-2"
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
                  <Card key={problem.id} className="bg-white bg-opacity-5">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-2">
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
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-300">
                        This problem is recommended based on your{" "}
                        {type.name.toLowerCase()} profile.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
