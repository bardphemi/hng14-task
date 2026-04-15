// third-party libraries
import { Request, Response } from "express";
import httpStatus from "http-status";

// middleware
import { sendResponse } from "../../middlewares/responseHandler";

// utils import
import { AppError } from "../../utils/appError";

//service import 
import profileService from "./profile.service";

const isUuidV7 = (value: string): boolean => {
  const uuidV7Pattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidV7Pattern.test(value);
};

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
    if (data.length === 0) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        "No profile found"
      );
    }
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
  },

  /**
   * @description deletes a profile
   * @param req 
   * @param res 
   * @returns 
   */
  async deleteProfileById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params as { id: string };
    if (!id) {
      throw new AppError(
        "Missing or empty id",
        httpStatus.BAD_REQUEST
      );
    }
    if (!isUuidV7(id)) {
      throw new AppError(
        "Invalid id format",
        httpStatus.UNPROCESSABLE_ENTITY
      );
    }
    await profileService.deleteProfileById(id);
    return sendResponse(
      res,
      httpStatus.NO_CONTENT,
      null
    )
  },

  /**
   * @description fetches profile by id
   * @param req 
   * @param res 
   * @returns 
   */
  async fetchProfileById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params as { id: string };
    if (!id) {
      throw new AppError(
        "Missing or empty id",
        httpStatus.BAD_REQUEST
      );
    }
    if (!isUuidV7(id)) {
      throw new AppError(
        "Invalid id format",
        httpStatus.UNPROCESSABLE_ENTITY
      );
    }
    const profile = await profileService.fetchProfileById(id);
    if (!profile) {
      throw new AppError(
        "Profile not found",
        httpStatus.NOT_FOUND
      )
    }
    return sendResponse(
      res,
      httpStatus.OK,
      "Profile fetched successfully",
      profile

    )
  }
};

export default profileCtrl;
