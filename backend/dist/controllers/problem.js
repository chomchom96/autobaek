import User from "../models/user.js";
import Problem from "../models/problem.js";
var RecommendationType;
(function (RecommendationType) {
    RecommendationType["DEFAULT"] = "default";
    RecommendationType["TOPIC"] = "topic";
    RecommendationType["PROGRESS"] = "progress";
    RecommendationType["STREAK"] = "streak";
})(RecommendationType || (RecommendationType = {}));
export class ProblemController {
    static MINIMUM_STREAK_LEVEL = 5;
    static MAX_RECOMMENDATIONS = 5;
    recommendProblem = async (req, res, next) => {
        try {
            const userId = req.id;
            const recommendationType = req.query.type;
            if (!Object.values(RecommendationType).includes(recommendationType)) {
                return res.status(400).json({ message: "Invalid recommendation type" });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const userLevel = user.level;
            const solvedProblems = new Set(user.solvedProblems.map((sp) => sp.problemId.toString()));
            const recommendedProblems = await this.getRecommendations(recommendationType, user, userLevel, solvedProblems);
            if (recommendedProblems.recommendations.length === 0) {
                return res.status(404).json({
                    message: "No recommended problems found",
                });
            }
            res.status(200).json({
                message: `${recommendationType} recommendations`,
                recommendations: recommendedProblems.recommendations,
            });
        }
        catch (err) {
            console.error("Problem recommendation error:", err);
            next(err);
        }
    };
    async getRecommendations(type, user, userLevel, solvedProblems) {
        const baseQuery = {
            _id: { $nin: Array.from(solvedProblems) },
        };
        let recommendations = [];
        try {
            switch (type) {
                case RecommendationType.DEFAULT:
                    recommendations = await this.getDefaultRecommendations(userLevel, baseQuery);
                    break;
                case RecommendationType.TOPIC:
                    recommendations = await this.getTopicBasedRecommendations(user, userLevel, baseQuery);
                    break;
                case RecommendationType.PROGRESS:
                    recommendations = await this.getProgressionRecommendations(userLevel, baseQuery);
                    break;
                case RecommendationType.STREAK:
                    recommendations = await this.getStreakRecommendations(userLevel, baseQuery);
                    break;
                default:
                    throw new Error("Invalid recommendation type");
            }
        }
        catch (error) {
            console.error(error);
            return { message: "Error fetching recommendations", recommendations: [] };
        }
        return { message: `${type} recommendations`, recommendations };
    }
    async getDefaultRecommendations(userLevel, baseQuery) {
        const problems = await Problem.find({
            ...baseQuery,
            level: {
                $gte: userLevel - 1,
                $lte: userLevel + 1,
            },
        })
            .sort({ submitCount: -1 })
            .limit(ProblemController.MAX_RECOMMENDATIONS);
        return problems.map((problem) => ({
            problemId: problem._id.toString(),
            problemTitle: problem.title,
            difficulty: problem.level,
            tags: problem.tags,
            recommendationReason: "Popular problem matching your current skill level",
        }));
    }
    async getTopicBasedRecommendations(user, userLevel, baseQuery) {
        const userTags = new Set();
        user.solvedProblems.forEach((problem) => {
            problem.tags?.forEach((tag) => userTags.add(tag));
        });
        const problems = await Problem.find({
            ...baseQuery,
            level: {
                $gte: userLevel - 1,
                $lte: userLevel + 1,
            },
        })
            .sort({ submitCount: -1 })
            .limit(50);
        const scoredProblems = problems
            .map((problem) => {
            const newTagCount = problem.tags.filter((tag) => !userTags.has(tag)).length;
            return {
                problem,
                newTagScore: newTagCount / problem.tags.length,
            };
        })
            .sort((a, b) => b.newTagScore - a.newTagScore)
            .slice(0, ProblemController.MAX_RECOMMENDATIONS);
        return scoredProblems.map(({ problem }) => ({
            problemId: problem._id.toString(),
            problemTitle: problem.title,
            difficulty: problem.level,
            tags: problem.tags,
            recommendationReason: "Contains topics you haven't explored much yet",
        }));
    }
    async getProgressionRecommendations(userLevel, baseQuery) {
        const problems = await Problem.find({
            ...baseQuery,
            level: {
                $gt: userLevel,
                $lte: userLevel + 2,
            },
        })
            .sort({ submitCount: -1 })
            .limit(ProblemController.MAX_RECOMMENDATIONS);
        return problems.map((problem) => ({
            problemId: problem._id.toString(),
            problemTitle: problem.title,
            difficulty: problem.level,
            tags: problem.tags,
            recommendationReason: "Slightly more challenging problem to help you improve",
        }));
    }
    async getStreakRecommendations(userLevel, baseQuery) {
        if (userLevel < ProblemController.MINIMUM_STREAK_LEVEL) {
            throw new Error("User level too low for streak problems");
        }
        const problems = await Problem.find({
            ...baseQuery,
            level: {
                $gte: Math.max(1, userLevel - 2),
                $lte: userLevel,
            },
        })
            .sort({ submitCount: -1 })
            .limit(ProblemController.MAX_RECOMMENDATIONS);
        return problems.map((problem) => ({
            problemId: problem._id.toString(),
            problemTitle: problem.title,
            difficulty: problem.level,
            tags: problem.tags,
            recommendationReason: "More approachable problem to maintain your solving streak",
        }));
    }
}
export default ProblemController;
