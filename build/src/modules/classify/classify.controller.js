"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
// service import
const classify_service_1 = __importDefault(require("./classify.service"));
// middleware
const responseHandler_1 = require("../../middlewares/responseHandler");
// utils import
const appError_1 = require("../../utils/appError");
// controller
const classifyCtrl = {
    /**
     * @description classifies name as male, female
     * @param req
     * @param res
     * @returns
     */
    async predictGender(req, res) {
        const { name } = req.query;
        if (!name) {
            throw new appError_1.AppError("Name query parameter is required", http_status_1.default.BAD_REQUEST);
        }
        ;
        if (typeof name === "string"
            && name.trim() !== ""
            && !isNaN(Number(name))) {
            throw new appError_1.AppError("Name query parameter must be a string", http_status_1.default.UNPROCESSABLE_ENTITY);
        }
        const formattedName = name.trim().toLowerCase();
        const result = await classify_service_1.default.predictGender(formattedName);
        return (0, responseHandler_1.sendResponse)(res, http_status_1.default.OK, "Gender prediction successful", result);
    }
};
exports.default = classifyCtrl;
