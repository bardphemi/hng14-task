// third-party imports
import httpStatus from "http-status"
import { Knex } from "knex";

// db config
import { db } from "../../config/db";

// utils import
import { AppError } from "../../utils/appError";

// interface
import { TokenDto } from "./auth.interface";
import logger from "../../utils/logger";

// 
const authDao = {
  /**
   * @description savews refersh token
   * @param payload 
   * @returns 
   */
  async saveRefreshToken(payload: TokenDto, trx = db as Knex) {
    try {
      return await db("refresh_tokens")
        .insert(payload)
        .returning("*");
    } catch (error) {
      throw new AppError(`${error}`, httpStatus.INTERNAL_SERVER_ERROR)
    }
  },

  /**
   * @description
   * @param hashedToken 
   * @param trx 
   * @returns 
   */
  async fetchTokenRecord(hashedToken: string, trx = db as Knex) {
    try {
      return await trx("refresh_tokens")
        .where({
          token_hash: hashedToken,
          is_revoked: false,
        })
        .first();
    } catch (error) {
      logger.error(`Error fetching token record: ${error}`);
      throw new AppError(`${error}`, httpStatus.INTERNAL_SERVER_ERROR)
    }
  },

  /**
   * @description revokwe expired token
   * @param tokenId 
   * @param trx 
   * @returns 
   */
  async revokeTokenById(tokenId: number, trx = db as Knex) {
    try {
      return await trx("refresh_tokens")
        .where({ id: tokenId })
        .update({ is_revoked: true });
    } catch (error) {
      logger.error(`Error revoking token: ${error}`);
      throw new AppError(`${error}`, httpStatus.INTERNAL_SERVER_ERROR)
    }
  },

  /**
   * @description revokes token on logout
   * @param tokenHash 
   * @returns 
   */
  async revokeToken(tokenHash: string) {
    try {
      const affectedRows = await db("refresh_tokens")
        .where({ token_hash: tokenHash, is_revoked: false })
        .update({ is_revoked: true });
      if (affectedRows === 0) {
        throw new AppError(
          "Token not found or already revoked",
          httpStatus.NOT_FOUND);
      }
      return affectedRows;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`[revokeToken] Error revoking token: ${error}`);
      throw new AppError(
        `${error}`,
        httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
};

export default authDao;

