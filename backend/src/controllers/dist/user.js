"use strict";
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
exports.UserController = void 0;
var user_js_1 = require("../models/user.js");
var problem_js_1 = require("../models/problem.js");
var solvedacService_js_1 = require("../services/solvedacService.js");
var UserController = /** @class */ (function () {
    function UserController() {
        var _this = this;
        this.searchUser = function (req, res, next) { return __awaiter(_this, void 0, Promise, function () {
            var query, _a, count, items, searchResult, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        query = req.query.user;
                        return [4 /*yield*/, solvedacService_js_1["default"].searchUsers(query)];
                    case 1:
                        _a = _b.sent(), count = _a.count, items = _a.items;
                        if (count === 0) {
                            return [2 /*return*/, res.status(200).json({ searchResult: [] })];
                        }
                        searchResult = items
                            .slice(0, Math.min(count, 10))
                            .map(function (item) { return [item.handle, item.tier]; });
                        return [2 /*return*/, res.status(200).json({ searchResult: searchResult })];
                    case 2:
                        err_1 = _b.sent();
                        next(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getUserInfo = function (req, res, next) { return __awaiter(_this, void 0, Promise, function () {
            var userId, isUserPage, existingUser, _a, tier, maxStreak, error_1, _b, userInfo, userProblems, tier, maxStreak, count, items, totalPages, solvedProblems, i, _c, count_1, items_2, _i, items_1, item, bojId, tried, problem, problemTags, newUser, savedUser, saveError_1, error_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 21, , 22]);
                        userId = req.query.id;
                        isUserPage = req.query.isUserPage;
                        return [4 /*yield*/, user_js_1["default"].findOne({ id: userId })];
                    case 1:
                        existingUser = _d.sent();
                        if (!((existingUser === null || existingUser === void 0 ? void 0 : existingUser.level) === 0 || (existingUser === null || existingUser === void 0 ? void 0 : existingUser.maxStreak) === null)) return [3 /*break*/, 6];
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 5, , 6]);
                        console.log("level = ", existingUser.level, ",maxStreak = ", existingUser.maxStreak);
                        return [4 /*yield*/, solvedacService_js_1["default"].getUserInfo(userId)];
                    case 3:
                        _a = _d.sent(), tier = _a.tier, maxStreak = _a.maxStreak;
                        existingUser.level = tier;
                        existingUser.maxStreak = maxStreak;
                        return [4 /*yield*/, existingUser.save()];
                    case 4:
                        _d.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _d.sent();
                        console.error("Error fetching data from SolvedacApi", error_1);
                        return [3 /*break*/, 6];
                    case 6:
                        if (!!existingUser) return [3 /*break*/, 20];
                        return [4 /*yield*/, Promise.all([
                                solvedacService_js_1["default"].getUserInfo(userId),
                                solvedacService_js_1["default"].getUserProblemAll(userId, 1),
                            ])];
                    case 7:
                        _b = _d.sent(), userInfo = _b[0], userProblems = _b[1];
                        tier = userInfo.tier, maxStreak = userInfo.maxStreak;
                        count = userProblems.count, items = userProblems.items;
                        totalPages = Math.ceil(count / 50);
                        solvedProblems = [];
                        i = 1;
                        _d.label = 8;
                    case 8:
                        if (!(i <= totalPages)) return [3 /*break*/, 16];
                        return [4 /*yield*/, solvedacService_js_1["default"].getUserProblemAll(userId, i)];
                    case 9:
                        _c = _d.sent(), count_1 = _c.count, items_2 = _c.items;
                        _i = 0, items_1 = items_2;
                        _d.label = 10;
                    case 10:
                        if (!(_i < items_1.length)) return [3 /*break*/, 15];
                        item = items_1[_i];
                        bojId = item.problemId;
                        tried = item.tried || 0;
                        return [4 /*yield*/, problem_js_1["default"].findOne({ bojId: bojId })];
                    case 11:
                        problem = _d.sent();
                        if (!!problem) return [3 /*break*/, 13];
                        problemTags = item.tags
                            ? item.tags
                                .map(function (tag) { var _a, _b; return (_b = (_a = tag.displayNames) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.name; })
                                .filter(Boolean)
                            : [];
                        return [4 /*yield*/, problem_js_1["default"].create({
                                bojId: item.problemId,
                                title: item.titleKo,
                                level: item.level,
                                averageTries: item.averageTries,
                                tags: problemTags
                            })];
                    case 12:
                        problem = _d.sent();
                        _d.label = 13;
                    case 13:
                        solvedProblems.push({
                            problemId: problem._id.toString(),
                            tried: tried,
                            averageTries: problem.averageTries || 0,
                            tags: problem.tags || []
                        });
                        _d.label = 14;
                    case 14:
                        _i++;
                        return [3 /*break*/, 10];
                    case 15:
                        i++;
                        return [3 /*break*/, 8];
                    case 16:
                        newUser = new user_js_1["default"]({
                            id: userId,
                            level: tier,
                            solvedCnt: count || solvedProblems.length,
                            solvedProblems: solvedProblems,
                            maxStreak: maxStreak
                        });
                        _d.label = 17;
                    case 17:
                        _d.trys.push([17, 19, , 20]);
                        return [4 /*yield*/, newUser.save()];
                    case 18:
                        savedUser = _d.sent();
                        console.log("User created successfully:", {
                            userId: savedUser.id,
                            solvedProblemsCount: savedUser.solvedProblems.length,
                            level: savedUser.level
                        });
                        return [2 /*return*/, res.status(201).json(savedUser.id)];
                    case 19:
                        saveError_1 = _d.sent();
                        if (saveError_1.name === "ValidationError") {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Validation Failed",
                                    errors: Object.values(saveError_1.errors).map(function (err) { return err.message; })
                                })];
                        }
                        throw saveError_1;
                    case 20: return [2 /*return*/, res.status(200).json(existingUser)];
                    case 21:
                        error_2 = _d.sent();
                        console.error("User info fetch error:", error_2);
                        next(error_2);
                        return [3 /*break*/, 22];
                    case 22: return [2 /*return*/];
                }
            });
        }); };
    }
    return UserController;
}());
exports.UserController = UserController;
exports["default"] = UserController;
