"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfidence = void 0;
/**
 * @description Utility function to determine confidence
 * @param probability
 * @param sampleSize
 * @returns
 */
const getConfidence = (probability, sampleSize) => {
    if (probability >= 0.7 && sampleSize >= 100) {
        return true;
    }
    return false;
};
exports.getConfidence = getConfidence;
