// third-party libraries
import { Router } from "express";

// controller
import userCtrl from "./user.controller";
import { asyncHandler } from "../../utils/asyncHandler";

// router
const userRouter = Router();

// routes
userRouter
  .route("/")
  .get(asyncHandler(userCtrl.fetchUsers))

export default userRouter;
