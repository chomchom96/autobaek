import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { ProblemController } from "../controllers/problem";

const problemRouter = Router();
const problemController = new ProblemController();

// TODO : unknown 대신 타입 핸들링 처리법
problemRouter.get(
  "/recommend",
  problemController.recommendProblem as unknown as (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
);

export default problemRouter;
