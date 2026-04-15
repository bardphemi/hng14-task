"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// third-party libraires
const http_status_1 = __importDefault(require("http-status"));
// handler
const responseHandler_1 = require("../responseHandler");
// test suite
describe("sendResponse", () => {
    it("sends success response", () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        (0, responseHandler_1.sendResponse)(res, http_status_1.default.OK, "OK", { ok: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            status: "success",
            message: "OK",
            data: { ok: true },
        });
    });
});
