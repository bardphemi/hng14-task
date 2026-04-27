// third-party libraries
import { Request, Response } from "express";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import authService from "./auth.service";
import { sendResponse } from "../../middlewares/responseHandler";
// import { sendResponse } from "../../middlewares/responseHandler";

// constants
const { GITHUB_CLIENT_ID } = process.env;

//
const authCtrl = {
  /**
   * @description handles github redirect
   * @param req 
   * @param res 
   */
  async handleRedirect(req: Request, res: Response): Promise<void> {
    const redirectUri = "http://localhost:7777/auth/github/callback";
    const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=user:email`;
    res.redirect(url);
  },


  /**
   * @description 
   * @param req 
   * @param res 
   */
  async handlesCallback(req: Request, res: Response): Promise<Response> {
    const code = req.query.code as string;
    if (!code) {
      throw new AppError("No code provided", httpStatus.BAD_REQUEST);
    };
    const { user, accessToken, refreshToken } = await authService.handleGithubAuth(code);
    return sendResponse(
      res,
      httpStatus.OK,
      undefined,
      {
        user,
        accessToken,
        refreshToken
      },
      undefined,
      { flat: true }
    )
  },

  /**
   * @description handles creation and invalidation of refresh token
   * @param req 
   * @param res 
   * @returns 
   */
  async handleRefresh(req: Request, res: Response): Promise<Response> {
    const { refresh_token: refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError(
        "refreshToken is required",
        httpStatus.BAD_REQUEST
      );
    }
    const { access_token, refresh_token } = await authService.getRefreshToken(refreshToken);
    return sendResponse(
      res,
      httpStatus.OK,
      undefined,
      {
        access_token,
        refresh_token,
      },
      undefined,
      { flat: true });
  },

  /**
   * @description handles user logout
   * @param req 
   * @param res 
   * @returns 
   */
  async handleLogout(req: Request, res: Response): Promise<Response> {
    const header = req.headers["x-refresh-token"];
    const refreshToken = Array.isArray(header) ? header[0] : header;
    if (!refreshToken) {
      throw new AppError(
        "x-refresh-token header is required",
        httpStatus.BAD_REQUEST
      );
    }
    await authService.logout(refreshToken);
    return sendResponse(
      res,
      httpStatus.OK,
      undefined,
      true
    )
  }
};

export default authCtrl;

