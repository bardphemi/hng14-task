// third-party imports
import { Response } from "express";

// interface 
interface ApiResponse {
  status: string;
  message?:string;
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
  message?: string,
  data?: any,
  count?: number,
) => {
  const response: ApiResponse = {
    status: "success",
    message,
    data,
  };
  if (count !== undefined) {
    response.count = count;
  }
  return res
    .status(statusCode)
    .send(response);
};
