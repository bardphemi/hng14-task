"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// third-party libraries
const http_status_1 = __importDefault(require("http-status"));
const node_crypto_1 = require("node:crypto");
// data access object
const profile_dao_1 = __importDefault(require("./profile.dao"));
// service import
const classify_service_1 = __importDefault(require("../classify/classify.service"));
// utils import
const axiosUtil_1 = require("../../utils/axiosUtil");
const appError_1 = require("../../utils/appError");
// environment variables
const { NATIONALIZE_API_URL, AGIFY_API_URL } = process.env;
//
const profileService = {
    /**
     * @description fetches profiles based on optional filters
     * @param params
     * @returns
     */
    async fetchProfiles(params) {
        return await profile_dao_1.default.fetchProfiles(params);
    },
    /**
     * @description creates user profile from name
     * @param name
     */
    async createProfile(name) {
        const { gender, sample_size, probability } = await classify_service_1.default.predictGender(name);
        const { age, age_group } = await this.getAge(name);
        const { country_id, country_probability } = await this.getNationality(name);
        const profileDto = {
            id: (0, node_crypto_1.randomUUID)(),
            name,
            gender,
            gender_probability: probability,
            sample_size,
            age,
            age_group,
            country_id,
            country_probability
        };
        return await profile_dao_1.default.createOrGetProfile(profileDto);
    },
    /**
     * @description gets age and age group from name
     * @param name
     * @returns
     */
    async getAge(name) {
        const apiUrl = `${AGIFY_API_URL}?name=${name}`;
        try {
            const { data } = await axiosUtil_1.axiosInstance.get(apiUrl);
            const age = Number(data.age);
            if (age === null || age === undefined) {
                throw new appError_1.AppError("Agify returned an invalid response", http_status_1.default.BAD_GATEWAY);
            }
            let age_group;
            if (age >= 0 && age <= 12) {
                age_group = "child";
            }
            else if (age >= 13 && age <= 19) {
                age_group = "teenager";
            }
            else if (age >= 20 && age <= 59) {
                age_group = "adult";
            }
            else {
                age_group = "senior";
            }
            return {
                age,
                age_group,
            };
        }
        catch (error) {
            if (error.response) {
                throw new appError_1.AppError("Upstream or server failure", http_status_1.default.BAD_GATEWAY);
            }
            if (error instanceof appError_1.AppError) {
                throw error;
            }
            //axios error
            if (error.response) {
                throw new appError_1.AppError("Upstream or server failure", http_status_1.default.BAD_GATEWAY);
            }
            const errorMsg = error instanceof Error
                ? error.message
                : "Upstream or server failure";
            throw new appError_1.AppError(errorMsg, http_status_1.default.INTERNAL_SERVER_ERROR);
        }
    },
    /**
     * @description gets nationality and country id using name
     * @param name
     */
    async getNationality(name) {
        const apiUrl = `${NATIONALIZE_API_URL}?name=${name}`;
        try {
            const { data } = await axiosUtil_1.axiosInstance.get(apiUrl);
            const { country } = data;
            if (!country || country.length === 0) {
                throw new appError_1.AppError("Nationalize returned an invalid response", http_status_1.default.BAD_GATEWAY);
            }
            ;
            let max = country[0];
            for (let i = 1; i < country.length; i++) {
                if (country[i].probability > max.probability) {
                    max = country[i];
                }
            }
            return {
                country_id: max.country_id,
                country_probability: Number(max.probability.toFixed(2)),
            };
        }
        catch (error) {
            if (error.response) {
                throw new appError_1.AppError("Upstream or server failure", http_status_1.default.BAD_GATEWAY);
            }
            if (error instanceof appError_1.AppError) {
                throw error;
            }
            if (error.response) {
                throw new appError_1.AppError("Upstream or server failure", http_status_1.default.BAD_GATEWAY);
            }
            const errorMsg = error instanceof Error
                ? error.message
                : "Upstream or server failure";
            throw new appError_1.AppError(errorMsg, http_status_1.default.INTERNAL_SERVER_ERROR);
        }
    },
    /**
     * @description fetches profile by name
     * @param name
     * @returns
     */
    async fetchProfileByName(name) {
        return await profile_dao_1.default.fetchProfileByName(name);
    },
    /**
     * @description deletes a profile by id
     * @param id
     * @returns
     */
    async deleteProfileById(id) {
        return await profile_dao_1.default.deleteProfileById(id);
    },
    /**
     * @description
     * @param id
     * @returns
     */
    async fetchProfileById(id) {
        return await profile_dao_1.default.fetchProfileById(id);
    }
};
exports.default = profileService;
