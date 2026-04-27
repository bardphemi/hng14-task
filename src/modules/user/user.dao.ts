// third-party libraries
import httpStatus from "http-status";

// database config
import { db } from "../../config/db";

// utils import
import { AppError } from "../../utils/appError";
import logger from "../../utils/logger";

// interface
import { NewUser } from "./user.interface";
import { Knex } from "knex";

//
const userDao = {
  /**
   * @description fetch a user by github id
   * @param githubId 
   * @returns 
   */
  async fetchUserByGithubId(githubId: string) {
    try {
      return await db("users")
        .select("*")
        .where({ github_id: githubId })
        .first();
    } catch (error) {
      logger.error(`Error fetching user by github Id: ${error instanceof Error ? error.message : String(error)
        }`)
      throw new AppError(
        `${error instanceof Error ? error.message : String(error)}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * @description creates a new user
   * @param payload 
   * @returns 
   */
  async createUser(payload: NewUser) {
    try {
      const [user] = await db("users")
        .insert(
          db("roles")
            .select({
              id: payload.id,
              github_id: payload.github_id,
              username: payload.username,
              email: payload.email,
              avatar_url: payload.avatar_url,
              role_id: db.ref("roles.id"),
              role: db.ref("roles.name"),
              created_at: db.fn.now(),
            })
            .where("roles.name", "analyst")
        )
        .returning("*");
      if (!user) {
        throw new AppError(
          "Role 'analyst' not found",
          httpStatus.INTERNAL_SERVER_ERROR);
      }
      return user;
    } catch (error) {
      logger.error(
        `Error creating user: ${error instanceof Error ? error.message : String(error)
        }`
      );
      throw new AppError(
        error instanceof Error ? error.message : String(error),
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * @description handles fetching user details for referesh token generation
   * @param userId 
   * @param trx 
   * @returns 
   */
  async fetchUserDetailsForAuth(userId: string, trx = db as Knex) {
    try {
      return await trx("users as u")
        .join("roles as r", "u.role_id", "r.id")
        .select("u.id", "u.is_active", "r.name as role")
        .where("u.id", userId)
        .first();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`[fetchUserDetailsForAuth] Error fetching user details : ${errorMsg}`);
      throw new AppError(
        errorMsg,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
};

export default userDao;

