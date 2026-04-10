// third-party imports
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

//util(s) import
import { AppError } from "../utils/appError";
import logger from "../utils/logger";

/**
 * @description global error handling middleware
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .send({
        status: "error",
        message: err.message
      });
  }
  return res
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .send({
      status: "error",
      message: "Internal Server Error"
    });
};
