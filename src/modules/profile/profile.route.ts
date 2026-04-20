// third-party libraries
import { Router } from "express";

// controller
import profileCtrl from "./profile.controller";

// utils import
import { asyncHandler } from "../../utils/asyncHandler";
import { upload } from "../../utils/uploadUtil";

// router
const profileRouter = Router();

// route(s)
profileRouter.post(
  "/upload",
  upload.single("file"),
  asyncHandler(profileCtrl.uploadProfiles)
);
profileRouter
  .route("/")
  .get(asyncHandler(profileCtrl.fetchProfiles))
  .post(asyncHandler(profileCtrl.createProfile));
profileRouter
  .route("/:id")
  .get(asyncHandler(profileCtrl.fetchProfileById))
  .delete(asyncHandler(profileCtrl.deleteProfileById));

export default profileRouter;

