"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// third-party library import
const knex_1 = __importDefault(require("knex"));
// knexfile
const knexfile_1 = __importDefault(require("../../knexfile"));
// utils
const logger_1 = __importDefault(require("../utils/logger"));
const env = process.env.NODE_ENV || "development";
logger_1.default.info(`${env} database connected successfully`);
exports.db = (0, knex_1.default)(knexfile_1.default[env]);
