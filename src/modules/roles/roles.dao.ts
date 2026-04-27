// third-party libraries
import httpStatus from "http-status";

// db config
import { db } from "../../config/db";

// utils import
import { AppError } from "../../utils/appError"
import logger from "../../utils/logger"


//
const roleDao = {
  /**
   * @description fetches role by Id
   * @param roleId 
   * @returns 
   */
  async fetchRoleById(roleId: string) {
    try {
      return await db("roles").select("*").where({ id: roleId }).first();
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Internal Server Error";
      logger.error(`Error fetching role by id: ${errorMsg}`)
      throw new AppError(
        errorMsg,
        httpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
};

export default roleDao;
