// third-party libraries
import httpStatus from "http-status";

// db config
import { db } from "../../config/db";

// interface
import { FetchProfilesParams } from "./profile.interface";

// utils import
import { AppError } from "../../utils/appError";
import { FETCH_LIMIT } from "../../utils/constants";

// profile data access object
const profileDao = {
  /**
   * @description creates a profile
   * @param name 
   * @returns 
   */
  async createProfile(name: string) {
    try {
      return await db("profiles").insert({ name }).returning("*");
    } catch (error) {
      throw new AppError(
        `Error creating profile: ${error instanceof Error ? error.message : String(error)}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * @description fetchs all profiles with optional filters
   * @param fetchDto 
   */
  async fetchProfiles(fetchDto: FetchProfilesParams) {
    try {
      const { gender, countryId, ageGroup } = fetchDto;
      const baseQuery = db("profiles").modify((query) => {
        if (gender) query.where("gender", gender);
        if (countryId) query.where("country_id", countryId);
        if (ageGroup) query.where("age_group", ageGroup);
      });
      const dataQuery = baseQuery.clone().select("*").limit(FETCH_LIMIT);
      const countQuery = baseQuery.clone().count<{ count: string }>("id as count");
      const [data, countResult]: any = await Promise.all([dataQuery, countQuery]);
      return {
        data,
        count: Number(countResult[0].count),
      };
    }
    catch (error) {
      throw new AppError(
        `Error fetching profiles: ${error instanceof Error ? error.message : String(error)}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
};

export default profileDao;

