// third-party libraries
import { Router } from "express";

// utils import
import { asyncHandler } from "../../utils/asyncHandler";

// controller
import profileCtrl from "./profile.controller";

// router
const profileRouter = Router();

// route(s)
profileRouter.post(
  "/",
  asyncHandler(profileCtrl.createProfile)
);

export default profileRouter;

