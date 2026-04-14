// third-party library import
import knex from "knex";

// knexfile
import dbConfig from "../../knexfile";

// utils
import logger from "../utils/logger";

const env = process.env.NODE_ENV || "development";

logger.info(`${env} database connected successfully`);

export const db = knex(dbConfig[env]);
