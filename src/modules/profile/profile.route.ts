// third-party libraries
import { Router } from "express";

// controller
import profileCtrl from "./profile.controller";

// middlewwware
import { validator } from "../../middlewares/validator";
import { adminCheck } from "../../middlewares/handleAccess";

// utils import
import { asyncHandler } from "../../utils/asyncHandler";
import { upload } from "../../utils/uploadUtil";
import { exportProfilesQuerySchema, fetchProfilesQuerySchema, searchProfilesQuerySchema } from "../../utils/validationSchema";

// router
const profileRouter = Router();

// route(s)
profileRouter.post(
  "/upload",
  upload.single("file"),
  asyncHandler(profileCtrl.uploadProfiles)
);
profileRouter.get("/search",
  validator({ query: searchProfilesQuerySchema }),
  asyncHandler(profileCtrl.searchProfile)
)
profileRouter.get(
  "/export",
  validator({ query: exportProfilesQuerySchema }),
  asyncHandler(profileCtrl.exportProfiles));
profileRouter
  .route("/")
  .get(
    validator({ query: fetchProfilesQuerySchema }),
    asyncHandler(profileCtrl.fetchProfiles)
  )
  .post(
    adminCheck,
    asyncHandler(profileCtrl.createProfile));
profileRouter
  .route("/:id")
  .get(asyncHandler(profileCtrl.fetchProfileById))
  .delete(asyncHandler(profileCtrl.deleteProfileById));

export default profileRouter;

