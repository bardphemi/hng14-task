// third-party libraries
import { Request, Response } from "express";
import httpStatus from "http-status";

// middleware
import { sendResponse } from "../../middlewares/responseHandler";

// utils import
import { AppError } from "../../utils/appError";

//service import 
import profileService from "./profile.service";

//profile controller
const profileCtrl = {
  /**
   * @description fetches profile information
   * @param req 
   * @param res 
   * @returns
   */
  async fetchProfiles(req: Request, res: Response): Promise<Response> {
    const { gender, country_id, age_group } = req.query;
    const params = {
      gender,
      countryId: country_id,
      ageGroup: age_group
    }
    const { data, count } = await profileService.fetchProfiles(params);
    return sendResponse(
      res,
      httpStatus.OK,
      "Profiles fetched successfully",
      data,
      count,
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
        "Missing or empty name",
        httpStatus.BAD_REQUEST
      );
    };
    if (
      typeof name === "string"
      && name.trim() !== ""
      && !isNaN(Number(name))) {
      throw new AppError(
        "Invalid type",
        httpStatus.UNPROCESSABLE_ENTITY
      );
    }
    const formattedName = name.trim().toLowerCase();
    const existingProfile = await profileService.fetchProfileByName(formattedName);
    if (existingProfile) {
      return sendResponse(
        res,
        httpStatus.OK,
        "Profile already exists",
        existingProfile
      );
    }
    const profile = await profileService.createProfile(formattedName);
    return sendResponse(
      res,
      httpStatus.CREATED,
      "Profile created successfully",
      profile
    )
  }
};

export default profileCtrl;

