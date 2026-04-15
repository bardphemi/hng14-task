"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// handler
const asyncHandler_1 = require("../asyncHandler");
// test suite
describe("asyncHandler", () => {
    it("passes errors to next", async () => {
        const err = new Error("boom");
        const handler = (0, asyncHandler_1.asyncHandler)(async () => {
            throw err;
        });
        const next = jest.fn();
        await handler({}, {}, next);
        expect(next).toHaveBeenCalledWith(err);
    });
});
