// third-party libraries
import { Router } from "express";

// utils import
import { asyncHandler } from "../../utils/asyncHandler";

// controller
import profileCtrl from "./profile.controller";

// router
const profileRouter = Router();

// route(s)
profileRouter
  .route("/")
  .get(asyncHandler(profileCtrl.fetchProfiles))
  .post(asyncHandler(profileCtrl.createProfile));
profileRouter
  .route("/:id")
  // .get(asyncHandler(profileCtrl.fetchProfileById))
  .delete(asyncHandler(profileCtrl.deleteProfileById));

export default profileRouter;

