"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ProblemController = void 0;
var user_js_1 = require("../models/user.js");
var problem_js_1 = require("../models/problem.js");
var RecommendationType;
(function (RecommendationType) {
    RecommendationType["DEFAULT"] = "default";
    RecommendationType["TOPIC"] = "topic";
    RecommendationType["PROGRESS"] = "progress";
    RecommendationType["STREAK"] = "streak";
})(RecommendationType || (RecommendationType = {}));
var ProblemController = /** @class */ (function () {
    function ProblemController() {
        var _this = this;
        this.recommendProblem = function (req, res, next) { return __awaiter(_this, void 0, Promise, function () {
            var userId, recommendationType, user, userLevel, solvedProblems, recommendedProblems, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        userId = req.id;
                        recommendationType = req.query.type;
                        if (!Object.values(RecommendationType).includes(recommendationType)) {
                            return [2 /*return*/, res.status(400).json({ message: "Invalid recommendation type" })];
                        }
                        return [4 /*yield*/, user_js_1["default"].findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                        }
                        userLevel = user.level;
                        solvedProblems = new Set(user.solvedProblems.map(function (sp) { return sp.problemId.toString(); }));
                        return [4 /*yield*/, this.getRecommendations(recommendationType, user, userLevel, solvedProblems)];
                    case 2:
                        recommendedProblems = _a.sent();
                        if (recommendedProblems.recommendations.length === 0) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "No recommended problems found"
                                })];
                        }
                        res.status(200).json({
                            message: recommendationType + " recommendations",
                            recommendations: recommendedProblems.recommendations
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error("Problem recommendation error:", err_1);
                        next(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    }
    ProblemController.prototype.getRecommendations = function (type, user, userLevel, solvedProblems) {
        return __awaiter(this, void 0, Promise, function () {
            var baseQuery, recommendations, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        baseQuery = {
                            _id: { $nin: Array.from(solvedProblems) }
                        };
                        recommendations = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 12, , 13]);
                        _a = type;
                        switch (_a) {
                            case RecommendationType.DEFAULT: return [3 /*break*/, 2];
                            case RecommendationType.TOPIC: return [3 /*break*/, 4];
                            case RecommendationType.PROGRESS: return [3 /*break*/, 6];
                            case RecommendationType.STREAK: return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 2: return [4 /*yield*/, this.getDefaultRecommendations(userLevel, baseQuery)];
                    case 3:
                        recommendations = _b.sent();
                        return [3 /*break*/, 11];
                    case 4: return [4 /*yield*/, this.getTopicBasedRecommendations(user, userLevel, baseQuery)];
                    case 5:
                        recommendations = _b.sent();
                        return [3 /*break*/, 11];
                    case 6: return [4 /*yield*/, this.getProgressionRecommendations(userLevel, baseQuery)];
                    case 7:
                        recommendations = _b.sent();
                        return [3 /*break*/, 11];
                    case 8: return [4 /*yield*/, this.getStreakRecommendations(userLevel, baseQuery)];
                    case 9:
                        recommendations = _b.sent();
                        return [3 /*break*/, 11];
                    case 10: throw new Error("Invalid recommendation type");
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_1 = _b.sent();
                        console.error(error_1);
                        return [2 /*return*/, { message: "Error fetching recommendations", recommendations: [] }];
                    case 13: return [2 /*return*/, { message: type + " recommendations", recommendations: recommendations }];
                }
            });
        });
    };
    ProblemController.prototype.getDefaultRecommendations = function (userLevel, baseQuery) {
        return __awaiter(this, void 0, Promise, function () {
            var problems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, problem_js_1["default"].find(__assign(__assign({}, baseQuery), { level: {
                                $gte: userLevel - 1,
                                $lte: userLevel + 1
                            } }))
                            .sort({ submitCount: -1 })
                            .limit(ProblemController.MAX_RECOMMENDATIONS)];
                    case 1:
                        problems = _a.sent();
                        return [2 /*return*/, problems.map(function (problem) { return ({
                                problemId: problem._id.toString(),
                                problemTitle: problem.title,
                                difficulty: problem.level,
                                tags: problem.tags,
                                recommendationReason: "Popular problem matching your current skill level"
                            }); })];
                }
            });
        });
    };
    ProblemController.prototype.getTopicBasedRecommendations = function (user, userLevel, baseQuery) {
        return __awaiter(this, void 0, Promise, function () {
            var userTags, problems, scoredProblems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userTags = new Set();
                        user.solvedProblems.forEach(function (problem) {
                            var _a;
                            (_a = problem.tags) === null || _a === void 0 ? void 0 : _a.forEach(function (tag) { return userTags.add(tag); });
                        });
                        return [4 /*yield*/, problem_js_1["default"].find(__assign(__assign({}, baseQuery), { level: {
                                    $gte: userLevel - 1,
                                    $lte: userLevel + 1
                                } }))
                                .sort({ submitCount: -1 })
                                .limit(50)];
                    case 1:
                        problems = _a.sent();
                        scoredProblems = problems
                            .map(function (problem) {
                            var newTagCount = problem.tags.filter(function (tag) { return !userTags.has(tag); }).length;
                            return {
                                problem: problem,
                                newTagScore: newTagCount / problem.tags.length
                            };
                        })
                            .sort(function (a, b) { return b.newTagScore - a.newTagScore; })
                            .slice(0, ProblemController.MAX_RECOMMENDATIONS);
                        return [2 /*return*/, scoredProblems.map(function (_a) {
                                var problem = _a.problem;
                                return ({
                                    problemId: problem._id.toString(),
                                    problemTitle: problem.title,
                                    difficulty: problem.level,
                                    tags: problem.tags,
                                    recommendationReason: "Contains topics you haven't explored much yet"
                                });
                            })];
                }
            });
        });
    };
    ProblemController.prototype.getProgressionRecommendations = function (userLevel, baseQuery) {
        return __awaiter(this, void 0, Promise, function () {
            var problems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, problem_js_1["default"].find(__assign(__assign({}, baseQuery), { level: {
                                $gt: userLevel,
                                $lte: userLevel + 2
                            } }))
                            .sort({ submitCount: -1 })
                            .limit(ProblemController.MAX_RECOMMENDATIONS)];
                    case 1:
                        problems = _a.sent();
                        return [2 /*return*/, problems.map(function (problem) { return ({
                                problemId: problem._id.toString(),
                                problemTitle: problem.title,
                                difficulty: problem.level,
                                tags: problem.tags,
                                recommendationReason: "Slightly more challenging problem to help you improve"
                            }); })];
                }
            });
        });
    };
    ProblemController.prototype.getStreakRecommendations = function (userLevel, baseQuery) {
        return __awaiter(this, void 0, Promise, function () {
            var problems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (userLevel < ProblemController.MINIMUM_STREAK_LEVEL) {
                            throw new Error("User level too low for streak problems");
                        }
                        return [4 /*yield*/, problem_js_1["default"].find(__assign(__assign({}, baseQuery), { level: {
                                    $gte: Math.max(1, userLevel - 2),
                                    $lte: userLevel
                                } }))
                                .sort({ submitCount: -1 })
                                .limit(ProblemController.MAX_RECOMMENDATIONS)];
                    case 1:
                        problems = _a.sent();
                        return [2 /*return*/, problems.map(function (problem) { return ({
                                problemId: problem._id.toString(),
                                problemTitle: problem.title,
                                difficulty: problem.level,
                                tags: problem.tags,
                                recommendationReason: "More approachable problem to maintain your solving streak"
                            }); })];
                }
            });
        });
    };
    ProblemController.MINIMUM_STREAK_LEVEL = 5;
    ProblemController.MAX_RECOMMENDATIONS = 5;
    return ProblemController;
}());
exports.ProblemController = ProblemController;
exports["default"] = ProblemController;
