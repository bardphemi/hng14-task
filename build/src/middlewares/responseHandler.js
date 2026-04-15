"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
/**
 * @description api  response handler
 * @param res
 * @param statusCode
 * @param data
 * @param count
 * @returns
 */
const sendResponse = (res, statusCode, message, data, count) => {
    const response = {
        status: "success",
        message,
        data,
    };
    if (count !== undefined) {
        response.count = count;
    }
    return res
        .status(statusCode)
        .send(response);
};
exports.sendResponse = sendResponse;
