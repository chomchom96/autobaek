import ProblemRecommendations from "@/components/problem/ProblemRecommedation"

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Problem Recommendations</h1>
        <ProblemRecommendations />
      </div>
    </div>
  )
}

