// third-party libraries
import { Request, Response } from "express";
import httpStatus from "http-status";

// service import
import classifyService from "./classify.service";

// middleware
import { sendResponse } from "../../middlewares/responseHandler";

// utils import
import { AppError } from "../../utils/appError";

// controller
const classifyCtrl = {
  /**
   * @description classifies name as male, female
   * @param req 
   * @param res 
   * @returns 
   */
  async predictGender(req: Request, res: Response): Promise<Response> {
    const { name } = req.query as { name: string };
    if (!name) {
      throw new AppError(
        "Name query parameter is required",
        httpStatus.BAD_REQUEST
      );
    };
    if (
      typeof name === "string"
      && name.trim() !== ""
      && !isNaN(Number(name))) {
      throw new AppError(
        "Name query parameter must be a string",
        httpStatus.UNPROCESSABLE_ENTITY
      );
    }
    const formattedName = name.trim().toLowerCase();
    const result = await classifyService.predictGender(formattedName);
    return sendResponse(
      res,
      httpStatus.OK,
      result
    );
  }
};

export default classifyCtrl;

