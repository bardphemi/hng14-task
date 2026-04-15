"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// util import
const nameUtil_1 = require("../nameUtil");
// tests suite for getConfidence function
describe("getConfidence", () => {
    it("returns true when probability >= 0.7 and sample size >= 100", () => {
        expect((0, nameUtil_1.getConfidence)(0.7, 100)).toBe(true);
        expect((0, nameUtil_1.getConfidence)(0.9, 150)).toBe(true);
    });
    it("returns false when probability or sample size is below threshold", () => {
        expect((0, nameUtil_1.getConfidence)(0.69, 100)).toBe(false);
        expect((0, nameUtil_1.getConfidence)(0.7, 99)).toBe(false);
        expect((0, nameUtil_1.getConfidence)(0.2, 10)).toBe(false);
    });
});
