// third-party libraries
import { Request, Response } from "express";
import httpStatus from "http-status";

// utility functions
import logger from "../../utils/logger";

// service import
import classifyService from "./classify.service";

// controller
const classifyCtrl = {
  /**
   * @description classifies name as male, female
   * @param req 
   * @param res 
   * @returns 
   */
  async predictGender(req: Request, res: Response): Promise<Response> {
    const { name } = req.query as { name: string };
    try {
      const result = await classifyService.predictGender(name);
      return res
        .status(httpStatus.OK)
        .send({
          status: "success",
          message: "Classify endpoint is active",
          data: result
        });
    } catch (error: any) {
      logger.error(`An error occurred while classifying the name: ${error.message}`);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: `An error occurred while classifying the name: ${error.message}`
        });
    }
  }
};

export default classifyCtrl;

