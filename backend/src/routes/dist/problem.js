"use strict";
exports.__esModule = true;
var express_1 = require("express");
var problem_js_1 = require("../controllers/problem.js");
var problemRouter = express_1.Router();
var problemController = new problem_js_1.ProblemController();
// TODO : unknown 대신 타입 핸들링 처리법
problemRouter.get("/recommend", problemController.recommendProblem);
exports["default"] = problemRouter;
