// third-party libraries
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";

// utils import
import { AppError } from "../utils/appError";

// interface
interface JwtPayload {
  userId: string;
  role: string;
}

/**
 * @description handles atuthentication check
 * @param req 
 * @param _res 
 * @param next 
 */
export const authCheck = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "Authorization token missing",
        httpStatus.UNAUTHORIZED);
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as JwtPayload;
    (req as any).user = {
      id: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    throw new AppError(
      "Invalid or expired token",
      httpStatus.UNAUTHORIZED);
  }
};


/**
 * @description check if user is an admin
 * @param req 
 * @param _res 
 * @param next 
 */
export const adminCheck = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  if (!user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }
  if (user.role !== "admin") {
    throw new AppError(
      "Forbidden: Admins only",
      httpStatus.FORBIDDEN);
  }
  next();
};
