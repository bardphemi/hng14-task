// third-party imports
import { Response } from "express";

// interface 
interface ApiResponse {
  status: string;
  data?: any;
  errors?: any;
}

/**
 * @description api  response handler
 * @param res 
 * @param statusCode 
 * @param data 
 * @returns 
 */
export const sendResponse = (
  res: Response,
  statusCode: number,
  data?: any
) => {
  const response: ApiResponse = {
    status: "success",
    data,
  };
  return res
    .status(statusCode)
    .send(response);
};
