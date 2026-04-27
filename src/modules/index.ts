// third-party libraire 
import { Router } from "express";

// router(s)
import classifyRouter from "./classify/classify.route";
import profileRouter from "./profile/profile.route";
// import authRouter from "./auth/auth.route";
import userRouter from "./user/user.route";
const mainRouter = Router();

// route(s)
mainRouter.use("/classify", classifyRouter)
mainRouter.use("/profiles", profileRouter)
mainRouter.use("/users", userRouter)

export default mainRouter;
