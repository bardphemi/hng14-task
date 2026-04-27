// third-party libraries
import { Router } from "express";

// controller
import authCtrl from "./auth.controller";

// utils import
import { asyncHandler } from "../../utils/asyncHandler";
import { refreshTokenSchema } from "../../utils/validationSchema";

// middleware
import { validator } from "../../middlewares/validator";
import { authCheck } from "../../middlewares/handleAccess";

// router
const authRouter = Router();

// routes
authRouter.get(
  "/github",
  asyncHandler(authCtrl.handleRedirect))
authRouter.get(
  "/github/callback",
  asyncHandler(authCtrl.handlesCallback)
)
authRouter.post(
  "/refresh",
  validator({ body: refreshTokenSchema }),
  asyncHandler(authCtrl.handleRefresh)
)
authRouter.post(
  "/logout",
  asyncHandler(authCtrl.handleLogout)
);

export default authRouter;

