// third-party libraries
import httpStatus from "http-status";

// db config
import { db } from "../../config/db";

// interface
import { FetchProfilesParams, ProfileDTO } from "./profile.interface";

// utils import
import { AppError } from "../../utils/appError";
import { FETCH_LIMIT } from "../../utils/constants";

// profile data access object
const profileDao = {
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
      const dataQuery = baseQuery.clone().select(
        "id",
        "name",
        "gender",
        "gender_probability",
        "sample_size",
        "age",
        "age_group",
        "country_id",
        "country_probability",
        "created_at"
      )
        .limit(FETCH_LIMIT)
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
  },

  /**
   * @description fetches profile by name
   * @param name 
   * @returns 
   */
  async fetchProfileByName(name: string) {
    try {
      return await db("profiles").where({ name }).select(
        "id",
        "name",
        "gender",
        "gender_probability",
        "sample_size",
        "age",
        "age_group",
        "country_id",
        "country_probability",
        "created_at",
      ).first();
    } catch (error) {
      throw new AppError(
        `Upstream or server failure: ${error instanceof Error ? error.message : String(error)}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * @description creates a new profile or returns existing one based on name
   * @param data 
   * @returns 
   */
  async createOrGetProfile(payload: ProfileDTO) {
    try {
      const [profile] = await db("profiles")
        .insert({
          ...payload,
          created_at: db.fn.now(),
        })
        .onConflict("name")
        .merge()
        .returning([
          "id",
          "name",
          "gender",
          "gender_probability",
          "sample_size",
          "age",
          "age_group",
          "country_id",
          "country_probability",
          "created_at",
        ]);
      return profile;
    } catch (error) {
      throw new AppError(
        `Upstream or server failure: ${error instanceof Error ? error.message : String(error)}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * @description deletes a profile by id
   * @param id 
   * @returns 
   */
  async deleteProfileById(id: string) {
    try {
      const deletedCount = await db("profiles")
        .where({ id })
        .del();
      if (deletedCount === 0) {
        throw new AppError(
          "Profile not found",
          httpStatus.NOT_FOUND
        );
      }
    } catch (error) {
      throw new AppError(
        `Upstream or server failure: ${error instanceof Error ? error.message : String(error)}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
};

export default profileDao;

