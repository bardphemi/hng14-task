// third-party libraries
import { Router } from "express";

// controller
import userCtrl from "./user.controller";

// utils import 
import { asyncHandler } from "../../utils/asyncHandler";

// middleware
import { adminCheck } from "../../middlewares/handleAccess";

// router
const userRouter = Router();

// routes
userRouter
  .route("/")
  .get(adminCheck, asyncHandler(userCtrl.fetchUsers))

export default userRouter;
