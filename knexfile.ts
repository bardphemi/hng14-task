// third-party libraries
import type { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();

// system variables
const { DATABASE_URL, DEV_DATABASE_URL } = process.env;

// config
const dbConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: DEV_DATABASE_URL,
    migrations: {
      directory: "./src/database/migrations"
    },
    seeds: {
      directory: "./src/database/seeds"
    }
  },
  production: {
    client: "pg",
    connection: {
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./src/database/migrations"
    },
    seeds: {
      directory: "./src/database/seeds"
    }
  }
};

export default dbConfig;
