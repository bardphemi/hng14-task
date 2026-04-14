// third-party imports
import { Response } from "express";

// interface 
interface ApiResponse {
  status: string;
  count?: number;
  data?: any;
  errors?: any;
}

/**
 * @description api  response handler
 * @param res 
 * @param statusCode 
 * @param data 
 * @param count 
 * @returns 
 */
export const sendResponse = (
  res: Response,
  statusCode: number,
  data?: any,
  count?: number,
) => {
  const response: ApiResponse = {
    status: "success",
    data,
  };
  if (count !== undefined) {
    response.count = count;
  }
  return res
    .status(statusCode)
    .send(response);
};
