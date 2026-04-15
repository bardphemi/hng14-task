"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// util
const appError_1 = require("../appError");
// test suite for AppError
describe("AppError", () => {
    it("sets statusCode and message", () => {
        const err = new appError_1.AppError("Nope", 418);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Nope");
        expect(err.statusCode).toBe(418);
    });
});
