// third-party libraries
import { Router } from "express";

// comntroller
import classifyCtrl from "./classify.controller";

// utils
import { asyncHandler } from "../../utils/asyncHandler";

// router instance
const classifyRouter = Router();

// rourtes
classifyRouter.get(
  "/",
  asyncHandler(classifyCtrl.predictGender)
);

export default classifyRouter;
