// third-party libraire 
import { Router } from "express";

// middleware
import { apiVersionMiddleware } from "../middlewares/apiVersioning";

// router(s)
import classifyRouter from "./classify/classify.route";
import profileRouter from "./profile/profile.route";
import userRouter from "./user/user.route";
const mainRouter = Router();

// route(s)
mainRouter.use("/classify", classifyRouter)
mainRouter.use("/profiles", apiVersionMiddleware, profileRouter)
mainRouter.use("/users", userRouter)

export default mainRouter;
