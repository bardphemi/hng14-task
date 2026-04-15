"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
//util(s) import
const appError_1 = require("../utils/appError");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * @description global error handling middleware
 * @param err
 * @param res
 * @returns
 */
const globalErrorHandler = (err, req, res, next) => {
    logger_1.default.error(err.message || err);
    if (err instanceof appError_1.AppError) {
        return res
            .status(err.statusCode)
            .send({
            status: "error",
            message: err.message
        });
    }
    return res
        .status(http_status_1.default.INTERNAL_SERVER_ERROR)
        .send({
        status: "error",
        message: "Internal Server Error"
    });
};
exports.globalErrorHandler = globalErrorHandler;
