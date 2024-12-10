const User = requrie("../models/user");
const Problem = require("../models/problem");
const { SolvedacService } = require("../services/solvedacService");

// 추천 문제 반환 controller
exports.recommendProblem = async (req, res, next) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    const userLevel = user.avgLevel;
    const solvedProblems = user.solvedProblems.map((sp) => sp.problemId);

    const param = req.param;
    let recommendedProblemId = -1;

    switch (param) {
      // 기본 추천: 사용자 레벨에 맞는 문제 중 아직 풀지 않은 문제
      case "default":
        recommendedProblemId = await Problem.findOne({
          level: { $gte: userLevel - 1, $lte: userLevel + 1 },
          _id: { $nin: solvedProblems },
        })
          .sort({ submitCount: -1 })
          .limit(1);
        break;

      // 많이 틀리는 태그 기반 추천
      case "weak":
        const weakTagStats = user.solvedProblems.map((sp) => ({
          tag: sp.tags,
          diffRatio: sp.tried / sp.averageTries,
        }));

        // 가장 높은 diffRatio(실패율) 태그 찾기
        const worstTag = weakTagStats.sort(
          (a, b) => b.diffRatio - a.diffRatio
        )[0].tag;

        recommendedProblemId = await Problem.findOne({
          tags: { $in: worstTag },
          level: { $gte: userLevel - 1, $lte: userLevel + 1 },
          _id: { $nin: solvedProblems },
        })
          .sort({ submitCount: -1 })
          .limit(1);
        break;

      // 비슷한 사용자에 비해 덜 푼 문제 추천
      case "rare":
        // 레벨별 태그 평균 통계 가져오기
        const tagAverages = await User.getTagAverageByLevel(userLevel);

        // 사용자의 태그별 풀이 통계와 비교
        const rareProblemTags = tagAverages
          .filter(
            (stat) =>
              !user.solvedProblems.some(
                (sp) =>
                  sp.tags.includes(stat._id) &&
                  sp.tried > stat.avgSolvedProblems
              )
          )
          .map((stat) => stat.tag);

        recommendedProblemId = await Problem.findOne({
          tags: { $in: rareProblemTags },
          level: { $gte: userLevel - 1, $lte: userLevel + 1 },
          _id: { $nin: solvedProblems },
        })
          .sort({ submitCount: -1 })
          .limit(1);
        break;

      // 스트릭용 문제 추천 (브론즈 5부터)
      case "streak":
        if (userLevel < 5) {
          return res
            .status(400)
            .json({ message: "스트릭용 문제를 찾은 레베루가 아님" });
        }

        recommendedProblemId = await Problem.findOne({
          level: userLevel,
          _id: { $nin: solvedProblems },
        })
          .sort({ submitCount: -1 })
          .limit(1);
        break;

      default:
        return res
          .status(400)
          .json({ message: "Invalid recommendation parameter" });
    }

    if (!recommendedProblemId) {
      return res.status(404).json({ message: "추천 문제가 없습니다." });
    }

    res.status(200).json({
      message: `${param} recommended`,
      problemId: recommendedProblemId._id,
      // 이후 백준 url로 window 열기
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
