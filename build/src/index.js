"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app import
const app_1 = __importDefault(require("./app"));
// util(s) import
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = process.env.PORT;
app_1.default.listen(PORT, () => {
    logger_1.default.info(`API is active on port: ${PORT}`);
});
