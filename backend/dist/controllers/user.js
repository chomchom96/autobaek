import User from "../models/user.js";
import Problem from "../models/problem.js";
import SolvedacService from "../services/solvedacService.js";
export class UserController {
    searchUser = async (req, res, next) => {
        try {
            const query = req.query.user;
            const { count, items } = await SolvedacService.searchUsers(query);
            if (count === 0) {
                return res.status(200).json({ searchResult: [] });
            }
            const searchResult = items
                .slice(0, Math.min(count, 10))
                .map((item) => [item.handle, item.tier]);
            return res.status(200).json({ searchResult });
        }
        catch (err) {
            next(err);
        }
    };
    getUserInfo = async (req, res, next) => {
        try {
            const userId = req.query.id;
            const level = parseInt(req.query.level) || 0;
            const existingUser = await User.findOne({ id: userId });
            if (!existingUser) {
                const { count, items } = await SolvedacService.getUserProblemAll(userId, 1);
                const totalPages = Math.ceil(count / 50);
                // console.log("totalPages", totalPages);
                const solvedProblems = [];
                for (let i = 1; i <= totalPages; i++) {
                    const { count, items } = await SolvedacService.getUserProblemAll(userId, i);
                    for (const item of items) {
                        const bojId = item.problemId;
                        const tried = item.tried || 0;
                        let problem = await Problem.findOne({ bojId });
                        if (!problem) {
                            // const result = await SolvedacService.getProblemInfo(bojId);
                            const problemTags = item.tags
                                ? item.tags
                                    .map((tag) => tag.displayNames?.[0]?.name)
                                    .filter(Boolean)
                                : [];
                            problem = await Problem.create({
                                bojId: item.problemId,
                                title: item.titleKo,
                                level: item.level,
                                averageTries: item.averageTries,
                                tags: problemTags,
                            });
                        }
                        solvedProblems.push({
                            problemId: problem._id.toString(),
                            tried,
                            averageTries: problem.averageTries || 0,
                            tags: problem.tags || [],
                        });
                    }
                }
                const newUser = new User({
                    id: userId,
                    level,
                    solvedCnt: count || solvedProblems.length,
                    solvedProblems,
                });
                try {
                    const savedUser = await newUser.save();
                    console.log("User created successfully:", {
                        userId: savedUser.id,
                        solvedProblemsCount: savedUser.solvedProblems.length,
                        level: savedUser.level,
                    });
                    return res.status(201).json(savedUser.id);
                }
                catch (saveError) {
                    if (saveError.name === "ValidationError") {
                        return res.status(400).json({
                            message: "Validation Failed",
                            errors: Object.values(saveError.errors).map((err) => err.message),
                        });
                    }
                    throw saveError;
                }
            }
            return res.status(200).json(existingUser);
        }
        catch (error) {
            console.error("Overall user info fetch error:", error);
            next(error);
        }
    };
}
export default UserController;
