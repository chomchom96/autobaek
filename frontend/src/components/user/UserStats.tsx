import { useState } from "react";
import { motion } from "framer-motion";
import TagProblemGraph from "./TagProblemGraph";

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

export default function UserStats({ userData }: { userData: UserData }) {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  console.log(hoveredTag);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
          {userData.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{userData.name}</h2>
          <p className="text-gray-300">User ID: {userData.id}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-sm text-gray-300">Level</p>
          <p className="text-2xl font-semibold">{userData.level}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-sm text-gray-300">Problems Solved</p>
          <p className="text-2xl font-semibold">{userData.problemsSolved}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-sm text-gray-300">Current Streak</p>
          <p className="text-2xl font-semibold">{userData.streak} days</p>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Problems Solved by Tag</h3>
        <TagProblemGraph tagStats={userData.tagStats} />
        <div className="flex flex-wrap justify-center mt-4">
          {userData.tagStats.map((stat) => (
            <motion.div
              key={stat.tag}
              className="m-2 px-3 py-1 bg-blue-500 rounded-full text-sm cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => setHoveredTag(stat.tag)}
              onMouseLeave={() => setHoveredTag(null)}
            >
              {stat.tag}: {stat.count}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
