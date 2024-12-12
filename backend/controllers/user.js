const User = require("../models/user");
const Problem = require("../models/problem");
const SolvedacService = require("../services/solvedacService");

exports.searchUser = async (req, res, next) => {
  try {
    const query = req.query;
    const { count, items } = await SolvedacService.searchUsers(query);
    console.log(count, items);
    if (count === 0) return [];
    const searchResult = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      searchResult.push([items[i].handle, items[i].tier]);
    }
    res.status(201).json({
      searchResult: searchResult,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getUserInfo = async (req, res, next) => {
  const userId = req.id;
  const level = req.level;
  const { solvedCnt, totalItems } = SolvedacService.getUserProblemsAll(userId);
  const { _, tagItems } = SolvedacService.getUserProblemStats(userId);
  const solvedProblems = [];
  for (let item of totalItems) {
    let bojId = item.problemId;
    let tried = item.tried;
    let tags = [];
    for (let tag of item.tags) {
      tags.push(tag.key);
    }
    let problem = await Problem.findOne({ bojId: bojId });

    if (!problem) {
      try {
        const result = await SolvedacService.getProblemInfo(bojId);
        problem = await Problem.create({
          bojId: bojId,
          level: level,
          averageTries: result.averageTries,
          tags: tags,
        });
      } catch (error) {
        console.error("Error fetching problem data", error);
        next(err);
      }
    }

    solvedProblems.push({
      problemId: problem._id,
      tried: tried,
      averageTries: averageTries,
      tags: tags,
    });
  }
  const user = new User({
    id: userId,
    solvedProblesm: solvedProblems,
    solvedCnt: solvedCnt,
    level: level,
  });
  user.save().then((result) => {
    // TODO :
    // 페이지에 필요한 정보 반환하기
    // 태그별 누계 정보를 시각화 + 티어 평균 대비 비교 (가능시)
    // 프론트 작업하면서 병행할 예정
    try {
      res.status(201).json({
        tagItems: tagItems,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
};
