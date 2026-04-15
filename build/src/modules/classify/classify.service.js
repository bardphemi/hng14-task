"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// third-party libraries
const http_status_1 = __importDefault(require("http-status"));
// utility functions
const nameUtil_1 = require("../../utils/nameUtil");
const appError_1 = require("../../utils/appError");
const axiosUtil_1 = require("../../utils/axiosUtil");
// cache variables
const cache = new Map();
const TTL = 1000 * 60 * 60;
// environment variables
const { GENDERIZE_URL } = process.env;
// 
const classifyService = {
    /**
     * @description predicts gender
     * @param name
     * @returns
     */
    async predictGender(name) {
        const apiUrl = `${GENDERIZE_URL}?name=${name}`;
        try {
            //check cache for existing record
            const cached = cache.get(name);
            if (cached && cached.expiry > Date.now()) {
                return cached.value;
            }
            const { data } = await axiosUtil_1.axiosInstance.get(apiUrl);
            const processed_at = new Date().toISOString();
            //handle edge casess
            if (!data.gender || data.count === 0) {
                throw new appError_1.AppError("Genderize returned an invalid response", http_status_1.default.BAD_GATEWAY);
            }
            const is_confident = (0, nameUtil_1.getConfidence)(data.probability, data.count);
            const result = {
                name: data.name,
                gender: data.gender,
                sample_size: data.count,
                probability: data.probability,
                is_confident,
                processed_at
            };
            cache.set(name, {
                value: result,
                expiry: Date.now() + TTL
            });
            return result;
        }
        catch (error) {
            if (error.response) {
                throw new appError_1.AppError("Upstream service error", http_status_1.default.BAD_GATEWAY);
            }
            if (error instanceof appError_1.AppError) {
                throw error;
            }
            //handle axios error
            if (error.response) {
                throw new appError_1.AppError("Upstream service error", http_status_1.default.BAD_GATEWAY);
            }
            const errorMsg = error instanceof Error
                ? error.message
                : "Internal Server Error";
            throw new appError_1.AppError(errorMsg, http_status_1.default.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.default = classifyService;
