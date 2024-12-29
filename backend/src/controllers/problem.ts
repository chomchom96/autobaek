import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.js";
import Problem, { IProblem } from "../models/problem.js";

enum RecommendationType {
  DEFAULT = "default",
  TOPIC = "topic",
  PROGRESS = "progress",
  STREAK = "streak",
}

interface RecommendationRequest extends Request {
  id: string; // Custom property for user ID
  query: {
    type: RecommendationType; // Custom query type for recommendation type
  } & Request["query"];
}

interface RecommendationResponse {
  message: string;
  recommendations: {
    problemId: string;
    problemTitle?: string;
    difficulty?: number;
    recommendationReason?: string;
    tags?: string[];
  }[];
}

export class ProblemController {
  private static readonly MINIMUM_STREAK_LEVEL = 5;
  private static readonly MAX_RECOMMENDATIONS = 5;

  public recommendProblem = async (
    req: RecommendationRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<RecommendationResponse> | void> => {
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
      const solvedProblems = new Set(
        user.solvedProblems.map((sp) => sp.problemId.toString())
      );

      const recommendedProblems = await this.getRecommendations(
        recommendationType,
        user,
        userLevel,
        solvedProblems
      );

      if (recommendedProblems.recommendations.length === 0) {
        return res.status(404).json({
          message: "No recommended problems found",
        });
      }

      res.status(200).json({
        message: `${recommendationType} recommendations`,
        recommendations: recommendedProblems.recommendations,
      });
    } catch (err) {
      console.error("Problem recommendation error:", err);
      next(err);
    }
  };

  private async getRecommendations(
    type: RecommendationType,
    user: IUser,
    userLevel: number,
    solvedProblems: Set<string>
  ): Promise<RecommendationResponse> {
    const baseQuery = {
      _id: { $nin: Array.from(solvedProblems) },
    };

    let recommendations: {
      problemId: string;
      problemTitle?: string;
      difficulty?: number;
      recommendationReason?: string;
      tags?: string[];
    }[] = [];

    try {
      switch (type) {
        case RecommendationType.DEFAULT:
          recommendations = await this.getDefaultRecommendations(
            userLevel,
            baseQuery
          );
          break;

        case RecommendationType.TOPIC:
          recommendations = await this.getTopicBasedRecommendations(
            user,
            userLevel,
            baseQuery
          );
          break;

        case RecommendationType.PROGRESS:
          recommendations = await this.getProgressionRecommendations(
            userLevel,
            baseQuery
          );
          break;

        case RecommendationType.STREAK:
          recommendations = await this.getStreakRecommendations(
            userLevel,
            baseQuery
          );
          break;

        default:
          throw new Error("Invalid recommendation type");
      }
    } catch (error) {
      console.error(error);
      return { message: "Error fetching recommendations", recommendations: [] };
    }

    return { message: `${type} recommendations`, recommendations };
  }

  private async getDefaultRecommendations(
    userLevel: number,
    baseQuery: any
  ): Promise<
    {
      problemId: string;
      problemTitle: string;
      difficulty: number;
      tags: string[];
      recommendationReason: string;
    }[]
  > {
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

  private async getTopicBasedRecommendations(
    user: IUser,
    userLevel: number,
    baseQuery: any
  ): Promise<
    {
      problemId: string;
      problemTitle: string;
      difficulty: number;
      tags: string[];
      recommendationReason: string;
    }[]
  > {
    const userTags = new Set<string>();
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
        const newTagCount = problem.tags.filter(
          (tag) => !userTags.has(tag)
        ).length;
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

  private async getProgressionRecommendations(
    userLevel: number,
    baseQuery: any
  ): Promise<
    {
      problemId: string;
      problemTitle: string;
      difficulty: number;
      tags: string[];
      recommendationReason: string;
    }[]
  > {
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
      recommendationReason:
        "Slightly more challenging problem to help you improve",
    }));
  }

  private async getStreakRecommendations(
    userLevel: number,
    baseQuery: any
  ): Promise<
    {
      problemId: string;
      problemTitle: string;
      difficulty: number;
      tags: string[];
      recommendationReason: string;
    }[]
  > {
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
      recommendationReason:
        "More approachable problem to maintain your solving streak",
    }));
  }
}

export default ProblemController;
