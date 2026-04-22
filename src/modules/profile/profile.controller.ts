// third-party libraries
import { Request, Response } from "express";
import httpStatus from "http-status";
import fs from "fs";

// middleware
import { sendResponse } from "../../middlewares/responseHandler";
import { validator } from "../../middlewares/validator";

// utils import
import { AppError } from "../../utils/appError";
import logger from "../../utils/logger";

//service import 
import profileService from "./profile.service";
import { processProfilesStreamFromFile } from "../../utils/uploadUtil";
import { dedupe } from "../../utils/dedupe";

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
    // @ts-expect-error 
    const { query } = req.validated;

    const { data, total, page, limit } = await profileService.fetchProfiles(query);
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
      { total, page, limit },
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
  },

  /**
   * @description handles bulk profile upload
   * @param req 
   * @param res 
   * @returns 
   */
  async uploadProfiles(req: Request, res: Response): Promise<Response> {
    const file = (req as any).file;
    if (!file) {
      throw new AppError(
        "No file uploaded",
        httpStatus.BAD_REQUEST
      )
    }
    let inserted = 0;
    await processProfilesStreamFromFile(file.path, async (batch) => {
      const uniqueProfiles = dedupe(batch, (p) => `${p.name}-${p.country_id}-${p.age}`);
      const count = await profileService.bulkInsert(uniqueProfiles);
      inserted += count;
    });

    // cleanup
    fs.unlink(file.path, (err) => {
      if (err) logger.error("Failed to delete file:", err);
    });
    return sendResponse(
      res,
      httpStatus.CREATED,
      "Profiles uploaded successfully",
      inserted
    );
  }
};

export default profileCtrl;
