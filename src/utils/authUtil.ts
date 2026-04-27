// third-arty libraries
import jwt from "jsonwebtoken";
import crypto from "crypto";

// constants
import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP } from "./constants";

// interface
export interface JwtPayload {
  userId: string;
  role: string;
  roleId: string;
}

/**
 * @description generates access token
 * @param payload 
 * @returns 
 */
export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(
    { ...payload },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: ACCESS_TOKEN_EXP,
    });
};

/**
 * @description 
 * @returns 
 */
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

/**
 * @desc hashes token
 * @param token 
 * @returns 
 */
export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
};
