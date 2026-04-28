// third-party imports
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

// utils import
import { AppError } from "../utils/appError";

/**
 * @description checks for API version
 * @param req 
 * @param _res 
 * @param next 
 */
export const apiVersionMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction) => {
  const version = req.headers["x-api-version"];
  if (!version) {
    throw new AppError(
      "API version header required",
      httpStatus.BAD_REQUEST
    )
  }

  if (version !== "1") {
    throw new AppError(
      "Unsupported API version",
      httpStatus.BAD_REQUEST
    )
  }
  next();
}
