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
    baseUrl?: string;
  },
  options?: {
    flat?: boolean;
  }
) => {
  const response: any = {
    status: "success",
  };

  if (options?.flat && data && typeof data === "object") {
    Object.assign(response, data);
  } else {
    response.data = data;
  }

  if (message) {
    response.message = message;
  }

  if (pagination) {
    const { page = 1, limit = 10, total = 0, baseUrl = "" } = pagination;
    const totalPages = Math.ceil(total / limit);
    response.page = page;
    response.limit = limit;
    response.total = total;
    response.total_pages = totalPages;
    response.links = {
      self: `${baseUrl}?page=${page}&limit=${limit}`,
      next: page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
      prev: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
    };
  }

  return res.status(statusCode).send(response);
};

