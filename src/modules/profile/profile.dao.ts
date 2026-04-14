// third-party libraries
import httpStatus from "http-status";

// db config
import { db } from "../../config/db";

//
import { AppError } from "../../utils/appError";

// profile data access object
const profileDao = {

  async createProfile(name: string) {
    try {
      return await db("profiles").insert({ name }).returning("*");
    } catch (error) {
      throw new AppError(
        `Error creating profile: ${error instanceof Error ? error.message : String(error)}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
};

export default profileDao;

