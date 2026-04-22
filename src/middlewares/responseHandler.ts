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
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
  }
) => {
  const response: any = {
    status: "success",
    data,
  };
  if (message) {
    response.message = message;
  }
  if (pagination) {
    const { page, limit, total } = pagination;
    if (page !== undefined) response.page = page;
    if (limit !== undefined) response.limit = limit;
    if (total !== undefined) response.total = total;
  }

  return res.status(statusCode).send(response);
};

