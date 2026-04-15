"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// system variables
const { DATABASE_URL, DEV_DATABASE_URL } = process.env;
// config
dotenv_1.default.config();
const dbConfig = {
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
exports.default = dbConfig;
