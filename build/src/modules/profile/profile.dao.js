"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// third-party libraries
const http_status_1 = __importDefault(require("http-status"));
// db config
const db_1 = require("../../config/db");
// utils import
const appError_1 = require("../../utils/appError");
const constants_1 = require("../../utils/constants");
// profile data access object
const profileDao = {
    /**
     * @description fetchs all profiles with optional filters
     * @param fetchDto
     */
    async fetchProfiles(fetchDto) {
        try {
            const { gender, countryId, ageGroup } = fetchDto;
            const baseQuery = (0, db_1.db)("profiles").modify((query) => {
                if (gender) {
                    query.whereRaw("LOWER(gender) = ?", [gender.toLowerCase()]);
                }
                if (countryId) {
                    query.whereRaw("LOWER(country_id) = ?", [countryId.toLowerCase()]);
                }
                if (ageGroup) {
                    query.whereRaw("LOWER(age_group) = ?", [ageGroup.toLowerCase()]);
                }
            });
            const dataQuery = baseQuery
                .clone()
                .select("id", "name", "gender", "age", "age_group", "country_id", "created_at")
                .limit(constants_1.FETCH_LIMIT);
            const countQuery = baseQuery.clone().count("id as count");
            const [data, countResult] = await Promise.all([dataQuery, countQuery]);
            return {
                data,
                count: Number(countResult[0].count),
            };
        }
        catch (error) {
            throw new appError_1.AppError(`Error fetching profiles: ${error instanceof Error ? error.message : String(error)}`, http_status_1.default.INTERNAL_SERVER_ERROR);
        }
    },
    /**
     * @description fetches profile by name
     * @param name
     * @returns
     */
    async fetchProfileByName(name) {
        try {
            return await (0, db_1.db)("profiles").where({ name }).select("id", "name", "gender", "gender_probability", "sample_size", "age", "age_group", "country_id", "country_probability", "created_at").first();
        }
        catch (error) {
            throw new appError_1.AppError(`Upstream or server failure: ${error instanceof Error ? error.message : String(error)}`, http_status_1.default.INTERNAL_SERVER_ERROR);
        }
    },
    /**
     * @description creates a new profile or returns existing one based on name
     * @param data
     * @returns
     */
    async createOrGetProfile(payload) {
        try {
            const [profile] = await (0, db_1.db)("profiles")
                .insert({
                ...payload,
                created_at: db_1.db.fn.now(),
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
        }
        catch (error) {
            throw new appError_1.AppError(`Upstream or server failure: ${error instanceof Error ? error.message : String(error)}`, http_status_1.default.INTERNAL_SERVER_ERROR);
        }
    },
    /**
     * @description deletes a profile by id
     * @param id
     * @returns
     */
    async deleteProfileById(id) {
        try {
            const deletedCount = await (0, db_1.db)("profiles")
                .where({ id })
                .del();
            if (deletedCount === 0) {
                throw new appError_1.AppError("Profile not found", http_status_1.default.NOT_FOUND);
            }
        }
        catch (error) {
            throw new appError_1.AppError(`Upstream or server failure: ${error instanceof Error ? error.message : String(error)}`, http_status_1.default.INTERNAL_SERVER_ERROR);
        }
    },
    /**
     * @description fetch profile
     * @param id
     * @returns
     */
    async fetchProfileById(id) {
        try {
            return await (0, db_1.db)("profiles")
                .select("id", "name", "gender", "gender_probability", "sample_size", "age", "age_group", "country_id", "country_probability", "created_at")
                .where({ id })
                .first();
        }
        catch (error) {
            throw new appError_1.AppError(`Upstream or server failure: ${error instanceof Error ? error.message : String(error)}`, http_status_1.default.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.default = profileDao;
