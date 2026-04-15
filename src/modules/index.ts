// third-party libraire 
import { Router } from "express";

// router(s)
import classifyRouter from "./classify/classify.route";
import profileRouter from "./profile/profile.route";
const mainRouter = Router();

// route(s)
mainRouter.use("/classify", classifyRouter)
mainRouter.use("/profiles", profileRouter)

export default mainRouter;
