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
            var userId, level, existingUser, _a, count, items, totalPages, solvedProblems, i, _b, count_1, items_2, _i, items_1, item, bojId, tried, problem, problemTags, newUser, savedUser, saveError_1, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 16, , 17]);
                        userId = req.query.id;
                        level = parseInt(req.query.level) || 0;
                        return [4 /*yield*/, user_js_1["default"].findOne({ id: userId })];
                    case 1:
                        existingUser = _c.sent();
                        if (!!existingUser) return [3 /*break*/, 15];
                        return [4 /*yield*/, solvedacService_js_1["default"].getUserProblemAll(userId, 1)];
                    case 2:
                        _a = _c.sent(), count = _a.count, items = _a.items;
                        totalPages = Math.ceil(count / 50);
                        solvedProblems = [];
                        i = 1;
                        _c.label = 3;
                    case 3:
                        if (!(i <= totalPages)) return [3 /*break*/, 11];
                        return [4 /*yield*/, solvedacService_js_1["default"].getUserProblemAll(userId, i)];
                    case 4:
                        _b = _c.sent(), count_1 = _b.count, items_2 = _b.items;
                        _i = 0, items_1 = items_2;
                        _c.label = 5;
                    case 5:
                        if (!(_i < items_1.length)) return [3 /*break*/, 10];
                        item = items_1[_i];
                        bojId = item.problemId;
                        tried = item.tried || 0;
                        return [4 /*yield*/, problem_js_1["default"].findOne({ bojId: bojId })];
                    case 6:
                        problem = _c.sent();
                        if (!!problem) return [3 /*break*/, 8];
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
                    case 7:
                        problem = _c.sent();
                        _c.label = 8;
                    case 8:
                        solvedProblems.push({
                            problemId: problem._id.toString(),
                            tried: tried,
                            averageTries: problem.averageTries || 0,
                            tags: problem.tags || []
                        });
                        _c.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 5];
                    case 10:
                        i++;
                        return [3 /*break*/, 3];
                    case 11:
                        newUser = new user_js_1["default"]({
                            id: userId,
                            level: level,
                            solvedCnt: count || solvedProblems.length,
                            solvedProblems: solvedProblems
                        });
                        _c.label = 12;
                    case 12:
                        _c.trys.push([12, 14, , 15]);
                        return [4 /*yield*/, newUser.save()];
                    case 13:
                        savedUser = _c.sent();
                        console.log("User created successfully:", {
                            userId: savedUser.id,
                            solvedProblemsCount: savedUser.solvedProblems.length,
                            level: savedUser.level
                        });
                        return [2 /*return*/, res.status(201).json(savedUser.id)];
                    case 14:
                        saveError_1 = _c.sent();
                        if (saveError_1.name === "ValidationError") {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Validation Failed",
                                    errors: Object.values(saveError_1.errors).map(function (err) { return err.message; })
                                })];
                        }
                        throw saveError_1;
                    case 15: return [2 /*return*/, res.status(200).json(existingUser)];
                    case 16:
                        error_1 = _c.sent();
                        console.error("Overall user info fetch error:", error_1);
                        next(error_1);
                        return [3 /*break*/, 17];
                    case 17: return [2 /*return*/];
                }
            });
        }); };
    }
    return UserController;
}());
exports.UserController = UserController;
exports["default"] = UserController;
