// third-party libraries
import httpStatus from "http-status";

// db config
import { db } from "../../config/db";

// interface
import { FetchProfilesParams, ProfileDTO, ProfileInsert } from "./profile.interface";

// utils import
import { AppError } from "../../utils/appError";
import logger from "../../utils/logger";

// profile data access object
const profileDao = {
  /**
   * @description fetchs all profiles with optional filters
   * @param query 
   */
  async fetchProfiles(query: FetchProfilesParams) {
    try {
      const {
        gender,
        country_id,
        age_group,
        min_age,
        max_age,
        min_country_probability,
        min_gender_probability,
        sort_by = "created_at",
        order = "desc",
        page = 1,
        limit = 10,
      } = query;
      const baseQuery = db("profiles").modify((qb) => {
        if (gender) qb.where("gender", gender);
        if (country_id) qb.where("country_id", country_id);
        if (age_group) qb.where("age_group", age_group);
        if (min_age !== undefined) qb.where("age", ">=", min_age);
        if (max_age !== undefined) qb.where("age", "<=", max_age);
        if (min_country_probability !== undefined) {
          qb.where("country_probability", ">=", min_country_probability);
        }
        if (min_gender_probability !== undefined) {
          qb.where("gender_probability", ">=", min_gender_probability);
        }
      });

      const offset = (page - 1) * limit;
      const dataQuery = baseQuery
        .clone()
        .select(
          "id",
          "name",
          "gender",
          "gender_probability",
          "age",
          "age_group",
          "country_id",
          "country_name",
          "country_probability",
          "created_at"
        )
        .orderBy(sort_by, order)
        .orderBy("id", order)
        .limit(limit)
        .offset(offset);

      // fetch count
      const countQuery = baseQuery
        .clone()
        .count({ count: "id" }).first();
      const [data, countResult]: any = await Promise.all([dataQuery, countQuery]);
      return {
        data,
        total: Number(countResult.count),
        page,
        limit,
      };
    } catch (error) {
      throw new AppError(
        `Error fetching profiles: ${error instanceof Error ? error.message : String(error)
        }`,
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
        "country_name",
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
        .onConflict(["name", "age", "country_id"])
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
          "country_name",
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
  },

  /**
   * @description fetch profile
   * @param id 
   * @returns 
   */
  async fetchProfileById(id: string) {
    try {
      return await db("profiles")
        .select(
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
        )
        .where({ id })
        .first();
    } catch (error) {
      throw new AppError(
        `Upstream or server failure: ${error instanceof Error ? error.message : String(error)}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * @description handles bulk profile insert
   * @param profiles 
   * @returns 
   */
  async bulkInsert(profiles: ProfileInsert[]): Promise<number> {
    try {
      if (!profiles.length) {
        return 0;
      }
      const inserted = await db("profiles")
        .insert(profiles)
        .onConflict(["name", "age", "country_id"])
        .ignore()
        .returning("id");
      return inserted.length;
    } catch (error) {
      throw new AppError(
        `Upstream or server failure: ${error instanceof Error ? error.message : String(error)}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * @description streams data for export
   * @param query 
   * @returns 
   */
  async streamProfilesForExport(query: FetchProfilesParams) {
    try {
      const {
        gender,
        country_id,
        age_group,
        min_age,
        max_age,
        min_country_probability,
        min_gender_probability,
        sort_by = "created_at",
        order = "desc",
      } = query;
      const baseQuery = db("profiles").modify((qb) => {
        if (gender) qb.where("gender", gender);
        if (country_id) qb.where("country_id", country_id);
        if (age_group) qb.where("age_group", age_group);
        if (min_age !== undefined) qb.where("age", ">=", min_age);
        if (max_age !== undefined) qb.where("age", "<=", max_age);
        if (min_country_probability !== undefined) {
          qb.where("country_probability", ">=", min_country_probability);
        }
        if (min_gender_probability !== undefined) {
          qb.where("gender_probability", ">=", min_gender_probability);
        }
      });
      const queryBuilder = baseQuery
        .clone()
        .select(
          "id",
          "name",
          "gender",
          "gender_probability",
          "age",
          "age_group",
          "country_id",
          "country_name",
          "country_probability",
          "created_at"
        )
        .orderBy(sort_by, order);
      return queryBuilder.stream();
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error)
      logger.error(`[streamProfilesForExport] Error streaming profile data for export: ${errMessage}`)
      throw new AppError(
        errMessage,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },
};

export default profileDao;

