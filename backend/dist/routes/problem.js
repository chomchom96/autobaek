import { Router } from "express";
import { ProblemController } from "../controllers/problem.js";
const problemRouter = Router();
const problemController = new ProblemController();
// TODO : unknown 대신 타입 핸들링 처리법
problemRouter.get("/recommend", problemController.recommendProblem);
export default problemRouter;
