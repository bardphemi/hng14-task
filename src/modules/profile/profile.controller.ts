// third-party libraries
import { Request, Response } from "express";
import httpStatus from "http-status";

// middleware
import { sendResponse } from "../../middlewares/responseHandler";

// utils import
import { AppError } from "../../utils/appError";

// service import 
import profileService from "./profile.service";

//profile controller
const profileCtrl = {
  /**
   * @description fetches profile information
   * @param req 
   * @param res 
   * @returns
   */
  async fetchProfile(req: Request, res: Response): Promise<Response> {
    // const profiles = await profileService.fetchProfile();
    return sendResponse(
      res,
      httpStatus.OK,
      {}
    );
  },

  /**
   * @description creates a profile
   * @param req 
   * @param res 
   * @returns 
   */
  async createProfile(req: Request, res: Response): Promise<Response> {
    const { name } = req.body as { name: string };
    if (!name) {
      throw new AppError(
        "Name parameter is required",
        httpStatus.BAD_REQUEST
      );
    };
    return sendResponse(
      res,
      httpStatus.OK,
      {}
    )
  }
};

export default profileCtrl;

