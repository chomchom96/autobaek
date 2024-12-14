const User = require("../models/user");
const Problem = require("../models/problem");
const SolvedacService = require("../services/solvedacService");

exports.searchUser = async (req, res, next) => {
  try {
    const query = req.query.user;
    const { count, items } = await SolvedacService.searchUsers(query);
    if (count === 0) return [];
    const searchResult = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      searchResult.push([items[i].handle, items[i].tier]);
    }
    res.status(201).json({
      searchResult: searchResult,
    });
  } catch (err) {
    next(err);
  }
};
exports.getUserInfo = async (req, res, next) => {
  const userId = req.query.id;
  const level = parseInt(req.query.level);

  try {
    const existingUser = await User.findOne({ id: userId });

    if (!existingUser) {
      const { count, items } = await SolvedacService.getUserProblemAll(userId);

      const solvedProblems = [];

      for (let item of items) {
        let bojId = item.problemId;
        let tried = item.tried || 0;

        try {
          let problem = await Problem.findOne({ bojId: bojId });

          if (!problem) {
            const result = await SolvedacService.getProblemInfo(bojId);

            const problemTags = result.tags
              ? result.tags
                  .map((tag) =>
                    tag.displayNames && tag.displayNames[0]
                      ? tag.displayNames[0].name
                      : null
                  )
                  .filter(Boolean)
              : [];

            problem = await Problem.create({
              bojId: result.problemId,
              title: result.titleKo,
              level: result.level,
              averageTries: result.averageTries,
              tags: problemTags,
            });
          }

          solvedProblems.push({
            problemId: problem._id,
            tried: tried,
            averageTries: problem.averageTries || 0,
            tags: problem.tags || [],
          });
        } catch (problemError) {
          console.error(`Error processing problem ${bojId}:`, problemError);
          continue;
        }
      }

      const newUser = new User({
        id: userId,
        level: level || 0,
        solvedCnt: count || solvedProblems.length,
        solvedProblems: solvedProblems,
      });

      try {
        const savedUser = await newUser.save();

        console.log("User created successfully:", {
          userId: savedUser.id,
          solvedProblemsCount: savedUser.solvedProblems.length,
          level: savedUser.level,
        });

        return res.status(201).json(savedUser);
      } catch (saveError) {
        console.error("User save error:", {
          message: saveError.message,
          errors: saveError.errors,
          name: saveError.name,
        });

        if (saveError.name === "ValidationError") {
          return res.status(400).json({
            message: "Validation Failed",
            errors: Object.values(saveError.errors).map((err) => err.message),
          });
        }

        next(saveError);
      }
    } else {
      return res.status(200).json(existingUser);
    }
  } catch (error) {
    console.error("Overall user info fetch error:", error);
    next(error);
  }
};
