"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
// middleware
const responseHandler_1 = require("../../middlewares/responseHandler");
// utils import
const appError_1 = require("../../utils/appError");
//service import 
const profile_service_1 = __importDefault(require("./profile.service"));
const isUuidV7 = (value) => {
    const uuidV7Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidV7Pattern.test(value);
};
//profile controller
const profileCtrl = {
    /**
     * @description fetches profile information
     * @param req
     * @param res
     * @returns
     */
    async fetchProfiles(req, res) {
        const { gender, country_id, age_group } = req.query;
        const params = {
            gender,
            countryId: country_id,
            ageGroup: age_group
        };
        const { data, count } = await profile_service_1.default.fetchProfiles(params);
        if (data.length === 0) {
            return (0, responseHandler_1.sendResponse)(res, http_status_1.default.NOT_FOUND, "No profile found");
        }
        return (0, responseHandler_1.sendResponse)(res, http_status_1.default.OK, "Profiles fetched successfully", data, count);
    },
    /**
     * @description creates a profile
     * @param req
     * @param res
     * @returns
     */
    async createProfile(req, res) {
        const { name } = req.body;
        if (!name) {
            throw new appError_1.AppError("Missing or empty name", http_status_1.default.BAD_REQUEST);
        }
        ;
        if (typeof name === "string"
            && name.trim() !== ""
            && !isNaN(Number(name))) {
            throw new appError_1.AppError("Invalid type", http_status_1.default.UNPROCESSABLE_ENTITY);
        }
        const formattedName = name.trim().toLowerCase();
        const existingProfile = await profile_service_1.default.fetchProfileByName(formattedName);
        if (existingProfile) {
            return (0, responseHandler_1.sendResponse)(res, http_status_1.default.OK, "Profile already exists", existingProfile);
        }
        const profile = await profile_service_1.default.createProfile(formattedName);
        return (0, responseHandler_1.sendResponse)(res, http_status_1.default.CREATED, "Profile created successfully", profile);
    },
    /**
     * @description deletes a profile
     * @param req
     * @param res
     * @returns
     */
    async deleteProfileById(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new appError_1.AppError("Missing or empty id", http_status_1.default.BAD_REQUEST);
        }
        if (!isUuidV7(id)) {
            throw new appError_1.AppError("Invalid id format", http_status_1.default.UNPROCESSABLE_ENTITY);
        }
        await profile_service_1.default.deleteProfileById(id);
        return (0, responseHandler_1.sendResponse)(res, http_status_1.default.NO_CONTENT, null);
    },
    /**
     * @description fetches profile by id
     * @param req
     * @param res
     * @returns
     */
    async fetchProfileById(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new appError_1.AppError("Missing or empty id", http_status_1.default.BAD_REQUEST);
        }
        if (!isUuidV7(id)) {
            throw new appError_1.AppError("Invalid id format", http_status_1.default.UNPROCESSABLE_ENTITY);
        }
        const profile = await profile_service_1.default.fetchProfileById(id);
        if (!profile) {
            throw new appError_1.AppError("Profile not found", http_status_1.default.NOT_FOUND);
        }
        return (0, responseHandler_1.sendResponse)(res, http_status_1.default.OK, "Profile fetched successfully", profile);
    }
};
exports.default = profileCtrl;
