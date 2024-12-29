import { Router } from "express";
import { UserController } from "../controllers/user.js";
const userRouter = Router();
const accountController = new UserController();
userRouter.get("/search", accountController.searchUser);
userRouter.get("/user", accountController.getUserInfo);
export default userRouter;
