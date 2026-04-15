"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosInstance = void 0;
//third-party libraries
const axios_1 = __importDefault(require("axios"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
// create axios instance
exports.axiosInstance = axios_1.default.create({
    timeout: 3000,
    httpAgent: new http_1.default.Agent({ keepAlive: true }),
    httpsAgent: new https_1.default.Agent({ keepAlive: true }),
});
