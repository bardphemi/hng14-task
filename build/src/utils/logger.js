"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// third party imports
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
// logger configuration
const logFormat = winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json());
const transportList = [
    new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
    }),
    new winston_daily_rotate_file_1.default({
        dirname: "logs",
        filename: "app-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "7d",
        level: "info",
    }),
];
const logger = (0, winston_1.createLogger)({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: logFormat,
    transports: transportList,
    exceptionHandlers: [
        new winston_1.transports.File({ filename: "logs/exceptions.log" }),
    ],
    rejectionHandlers: [
        new winston_1.transports.File({ filename: "logs/rejections.log" }),
    ],
});
exports.default = logger;
