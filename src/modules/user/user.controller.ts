// third-party libraries
import { Request, Response } from "express";
import httpStatus from "http-status";

// middleware
import { sendResponse } from "../../middlewares/responseHandler";

// user contoller
const userCtrl = {
  /**
   * @description fetches all users
   * @param req 
   * @param res 
   * @returns 
   */
  async fetchUsers(req: Request, res: Response): Promise<Response> {
    return sendResponse(
      res,
      httpStatus.OK,
      "Users fetched successfully",
    )
  }
}

export default userCtrl;

