import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Zap, Target } from 'lucide-react'


const recommendationTypes = [
  { id: 'skill-based', name: 'Skill-Based', icon: Brain },
  { id: 'popularity', name: 'Popularity', icon: TrendingUp },
  { id: 'difficulty', name: 'Difficulty', icon: Zap },
  { id: 'targeted', name: 'Targeted Practice', icon: Target },
]

const mockProblems = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Table'] },
  { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', tags: ['Linked List', 'Math'] },
  { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tags: ['Hash Table', 'String', 'Sliding Window'] },
  { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', tags: ['Array', 'Binary Search', 'Divide and Conquer'] },
  { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', tags: ['String', 'Dynamic Programming'] },
]

export default function ProblemRecommendations() {
  const [activeTab, setActiveTab] = useState('skill-based')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-4">
        {recommendationTypes.map((type) => (
          <TabsTrigger key={type.id} value={type.id} className="flex items-center space-x-2">
            <type.icon className="w-4 h-4" />
            <span>{type.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {recommendationTypes.map((type) => (
        <TabsContent key={type.id} value={type.id}>
          <AnimatePresence mode="wait">
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">{type.name} Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockProblems.map((problem, index) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={problem.difficulty === 'Easy' ? 'default' : problem.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                            {problem.difficulty}
                          </Badge>
                          {problem.tags.map((tag) => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">
                          This problem is recommended based on your {type.name.toLowerCase()} profile.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      ))}
    </Tabs>
  )
}

