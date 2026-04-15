"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// third-party libraries
const http_status_1 = __importDefault(require("http-status"));
// util imports
const errorHandler_1 = require("../errorHandler");
const appError_1 = require("../../utils/appError");
jest.mock("../../utils/logger", () => ({
    __esModule: true,
    default: {
        error: jest.fn(),
    },
}));
// 
describe("globalErrorHandler", () => {
    it("handles AppError with provided status", () => {
        const err = new appError_1.AppError("Bad", 400);
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        (0, errorHandler_1.globalErrorHandler)(err, {}, res, {});
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            status: "error",
            message: "Bad",
        });
    });
    it("handles unknown error with 500", () => {
        const err = new Error("Boom");
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        (0, errorHandler_1.globalErrorHandler)(err, {}, res, {});
        expect(res.status).toHaveBeenCalledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        expect(res.send).toHaveBeenCalledWith({
            status: "error",
            message: "Internal Server Error",
        });
    });
});
